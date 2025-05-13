package com.green.project.Leo;

import java.util.concurrent.locks.ReentrantLock;
import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ConcertBookingConcurrencyTest {

    @Autowired
    private com.green.project.Leo.repository.concert.ConcertScheduleRepository scheduleRepository;

    // 테스트용 스케줄 ID
    private Long testScheduleId;

    // 테스트용 락 관리 맵
    private static final Map<Long, ReentrantLock> scheduleLocks = new ConcurrentHashMap<>();

    @BeforeEach
    @Transactional
    public void setup() {
        // 테스트용 콘서트 스케줄 생성
        ConcertSchedule schedule = new ConcertSchedule();
        schedule.setAvailableSeats(100); // 10개의 좌석

        // 필요한 다른 정보 설정...

        // 저장 후 ID 저장
        ConcertSchedule savedSchedule = scheduleRepository.save(schedule);
        testScheduleId = savedSchedule.getScheduleId();

        System.out.println("테스트 스케줄 생성 완료: ID=" + testScheduleId + ", 좌석=" + savedSchedule.getAvailableSeats());
    }

    /**
     * 아임포트 없이 동시성 테스트를 위한 간소화된 예약 메서드
     */
    private boolean bookConcertTicket(Long scheduleId, int ticketQuantity) {
        // 락 획득
        ReentrantLock lock = scheduleLocks.computeIfAbsent(scheduleId, k -> new ReentrantLock());
        lock.lock();

        try {
            // 스케줄 조회
            ConcertSchedule schedule = scheduleRepository.findById(scheduleId).orElse(null);
            if (schedule == null) {
                System.out.println("스케줄 없음: " + scheduleId);
                return false;
            }

            // 매진 확인
            if (schedule.getStatus() == ConcertStatus.SOLD_OUT) {
                System.out.println("이미 매진된 공연입니다.");
                return false;
            }

            // 좌석 확인
            if (schedule.getAvailableSeats() < ticketQuantity) {
                System.out.println("좌석 부족: 요청=" + ticketQuantity + ", 가용=" + schedule.getAvailableSeats());
                return false;
            }

            // 좌석 수 업데이트
            int remainingSeats = schedule.getAvailableSeats() - ticketQuantity;
            schedule.setAvailableSeats(remainingSeats);

            // 매진 체크
            if (remainingSeats <= 0) {
                schedule.setStatus(ConcertStatus.SOLD_OUT);
                System.out.println("공연 매진 처리됨");
            }

            // 저장
            scheduleRepository.save(schedule);
            System.out.println("예약 성공: 남은 좌석=" + remainingSeats);

            return true;
        } finally {
            lock.unlock();
        }
    }

    @Test
    public void testConcurrentBooking() throws Exception {
        int numberOfThreads = 200; // 15개의 동시 요청
        ExecutorService service = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            final int ticketQuantity = 1; // 각 요청은 1장씩 예약

            service.execute(() -> {
                try {
                    boolean success = bookConcertTicket(testScheduleId, ticketQuantity);
                    if (success) {
                        successCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    System.out.println("예약 처리 중 오류 발생: " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });

            // 요청 간 약간의 시간 간격 추가 (필요시)
            // Thread.sleep(10);
        }

        // 모든 스레드가 완료될 때까지 대기
        latch.await();

        // 테스트 결과 확인
        ConcertSchedule finalSchedule = scheduleRepository.findById(testScheduleId).orElse(null);

        System.out.println("테스트 결과: 성공 예약 수=" + successCount.get() + ", 최종 남은 좌석=" + finalSchedule.getAvailableSeats());

        // 검증: 정확히 10개의 좌석만 예약되어야 함
        assertEquals(10, successCount.get(), "성공한 예약은 초기 가용 좌석 수와 같아야 합니다");
        assertEquals(0, finalSchedule.getAvailableSeats(), "모든 좌석이 예약되어 0이 되어야 합니다");
        assertEquals(ConcertStatus.SOLD_OUT, finalSchedule.getStatus(), "상태가 SOLD_OUT으로 변경되어야 합니다");

        service.shutdown();
    }
}