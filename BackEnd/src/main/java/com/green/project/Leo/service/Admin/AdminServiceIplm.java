package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.admin.concert.AdminConcertDTO;
import com.green.project.Leo.dto.admin.concert.ConcertTicketDetailDTO;
import com.green.project.Leo.dto.admin.concert.ConcertTicketListDTO;
import com.green.project.Leo.dto.admin.concert.RequestTicketModifyDTO;
import com.green.project.Leo.dto.admin.payment.ProductOrderDetailDTO;
import com.green.project.Leo.dto.admin.payment.ProductOrderListDTO;
import com.green.project.Leo.dto.admin.payment.ProductRefundListDTO;
import com.green.project.Leo.dto.admin.payment.RequestOrderModifyDTO;
import com.green.project.Leo.dto.admin.product.AdminProductDTO;
import com.green.project.Leo.dto.admin.payment.OrderItemDTO;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;

import com.green.project.Leo.dto.product.ProductDTO;

import com.green.project.Leo.dto.product.ResponseProductReviewDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.concert.*;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.repository.user.UserRepository;
import com.green.project.Leo.repository.concert.ConcertImageRepository;
import com.green.project.Leo.repository.concert.ConcertRepository;
import com.green.project.Leo.repository.concert.ConcertScheduleRepository;

import com.green.project.Leo.repository.concert.ConcertTicketRepository;
import com.green.project.Leo.repository.payment.RefundRepository;
import com.green.project.Leo.repository.product.*;

import com.green.project.Leo.util.CustomConcertFileUtil;
import com.green.project.Leo.util.CustomFileUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;


import java.util.*;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceIplm implements AdminService{
    private final ProductRepository productRepository;
    private final CustomFileUtil fileUtil;
    private final ProductImageRepository imageRepository;
    private final ModelMapper modelMapper;
    private final ConcertRepository concertRepository;
    private final CustomConcertFileUtil concertFileUtil;
    private final ConcertImageRepository concertImageRepository;
    private final ConcertScheduleRepository scheduleRepository;
    private final ConcertTicketRepository ticketRepository;
    private final ProductOrderRepository productOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductReviewRepository productReviewRepository;
    private final UserRepository userRepository;
    private final RefundRepository refundRepository;
    @Override
    public void addProduct(ProductDTO dto) {

        //상품정보 저장 엔티티로
        Product product = Product.builder()
                .pName(dto.getPname())
                .pdesc(dto.getPdesc())
                .pPrice(dto.getPrice())
                .pStock(dto.getPstock())
                .category(dto.getCategory())
                .build();

        //상품정보를 디비에 저장
        Product result = productRepository.save(product);

        //상품 이미지 저장 로직
        //dto에 받아온 파일을 먼저 파일로 저장후 파일이름을 받음
        if(!dto.getFiles().isEmpty()) {
            List<String> filelist = fileUtil.saveFiles(dto.getFiles());
            for(String i : filelist){
                //파일개수만큼 돌면서 이미지엔티티에 이미지이름과,상품정보를 셋하고 디비에 저장
                ProductImage image = ProductImage.builder().fileName(i).product(result).build();
                imageRepository.save(image);

            }
        }

    }

    @Override
    public void updateProduct(ProductDTO dto) {
        //기존 파일명
        List<String> historyFileNames = imageRepository.findFileNamesByPNo(dto.getPno());
        //새로 업로드할 파일
        List<MultipartFile> files = dto.getFiles();
        //새로 업로드된 파일 이름들
        List<String> newUploadFileNames = fileUtil.saveFiles(files);
        //화면에서 변화없이 유지된 파일들
        List<String> uploadFileNames = dto.getUploadFileNames();
        //유지되는 파일과 새로 업로드된 파일 목록
        if(newUploadFileNames != null && newUploadFileNames.size()>0){
            uploadFileNames.addAll(newUploadFileNames);
        }

        //변경된 상품정보 업데이트
        Product modifyProduct = productRepository.findById(dto.getPno()).orElseThrow(
                () -> new RuntimeException("상품을 찾을 수 없습니다: " + dto.getPno())
        );
        modifyProduct.pName(dto.getPname());
        modifyProduct.pPrice(dto.getPrice());
        modifyProduct.pdesc(dto.getPdesc());
        modifyProduct.pStock(dto.getPstock());
        modifyProduct.category(dto.getCategory());


        Product result = productRepository.save(modifyProduct);

        if(historyFileNames != null && historyFileNames.size()>0){
            //기존파일 중에서 지워야할 파일 찾아서 지우기
            List<String> removeFiles = historyFileNames.stream().filter(i->uploadFileNames.indexOf(i)==-1).collect(Collectors.toList());
            fileUtil.deleteFiles(removeFiles);
        }

        for(String i : uploadFileNames){
            //기존이미지 자리에 새로운 이미지로 바꿀때
            if(!historyFileNames.isEmpty()) {
                Long imgNo = imageRepository.findImageNoByFilename(historyFileNames.get(0));
                ProductImage productImage = imageRepository.findById(imgNo).orElseThrow();
                productImage.setFileName(i);
                imageRepository.save(productImage);
            }else {
                //기존이미지가 없고 새로운이미지만 추가할때
                ProductImage newProductImage = ProductImage.builder().fileName(i).product(result).build();
                imageRepository.save(newProductImage);
            }

        }
        //새로 추가한파일은 없고 기존에 있떤  이미지를 디비에 상품 이미지 테이블에서 삭제할때
        if(uploadFileNames.isEmpty()){
            //db에 상품에대한 이미지가없고 새로 추가한이미지도없으면 예외가 발생하기때문에 if문을 하나 추가하여서 예외처리함
            if (historyFileNames != null && !historyFileNames.isEmpty()){
                Long imgNo2 = imageRepository.findImageNoByFilename(historyFileNames.get(0));
                imageRepository.deleteById(imgNo2);
            }
        }

    }

    @Override
    @Transactional
    public void removeProduct(Long pno) {
        try {
            Product product = productRepository.findById(pno).orElseThrow(()-> new EntityNotFoundException("상품을 찾을수없습니다"));
            product.isDeleted(true);
            productRepository.save(product);
        } catch (Exception e) {
            // 예외 발생 시 트랜잭션 롤백 (자동으로 이루어짐)
            throw new RuntimeException("제품 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    @Transactional
    @Override
    public String addConcert(ConcertDTO concertDTO) {
        List<ConcertSchedule> concertScheduleList = new ArrayList<>();
        Concert concert = Concert.builder()
                .cName(concertDTO.getCname())
                .cPlace(concertDTO.getCplace())
                .cdesc(concertDTO.getCdesc())
                .cPrice(concertDTO.getCprice())
                .category(concertDTO.getCategory())
                .build();
        for (ConcertScheduleDTO i : concertDTO.getSchedulesDtoList()) {
            ConcertSchedule schedule = new ConcertSchedule();
            schedule.setConcert(concert);
            schedule.setStartTime(i.getStartTime());
            schedule.setEndTime(i.getEndTime());
            schedule.setTotalSeats(i.getTotalSeats());
            schedule.setAvailableSeats(i.getTotalSeats());
            schedule.setStatus(ConcertStatus.AVAILABLE);
            concertScheduleList.add(schedule);
        }
        concert.setSchedules(concertScheduleList);
        Concert result = concertRepository.save(concert);
        if (concertDTO.getFile()!=null) {
            String filename = concertFileUtil.saveFiles(concertDTO.getFile());
            ConcertImage image = ConcertImage.builder().fileName(filename).concert(result).build();
            concertImageRepository.save(image);
        }
        return "공연추가 완료";
     }

    @Transactional
    @Override
    public String updateConcert(ConcertDTO concertDTO ,List<Long> deleteIds) {
        System.out.println(concertDTO);
        System.out.println("서비스까지는 넘어옴");
        // 디비에 있는 기존 이미지파일 이름
        String historyFileName = concertImageRepository.findFileNameByCNo(concertDTO.getCno());
        System.out.println("기존 이미지 파일 가져옴");
        // 새로 업로드할 파일
        MultipartFile newfile = concertDTO.getFile();
        // 새로 업로드하는 파일 이름
        String newUploadFileName = concertFileUtil.saveFiles(newfile);

        for(Long i : deleteIds){
            List<ConcertTicket> referenceTicket = ticketRepository.findTicketByScheduleId(i);
            if(referenceTicket.isEmpty()){
                scheduleRepository.deleteById(i);
            }else{
                    throw new RuntimeException(referenceTicket.get(0).getConcertSchedule().getStartTime()+"에 시작하는 공연에 판매된 티켓이있어 스케줄 삭제가 불가합니다");
            }

        }

        // 콘서트 수정내용 반영해서 저장
        Concert modifyConcert = concertRepository.findById(concertDTO.getCno())
                .orElseThrow(() -> new RuntimeException("Concert not found"));
        System.out.println("새로저장할 스케줄 리스트생성에서 오류가났니?");
        modifyConcert.setCName(concertDTO.getCname());
        modifyConcert.setCPrice(concertDTO.getCprice());
        modifyConcert.setCdesc(concertDTO.getCdesc());
        modifyConcert.setCPlace(concertDTO.getCplace());
        modifyConcert.setCategory(concertDTO.getCategory());
        Concert modifiedConcert = concertRepository.save(modifyConcert);

        //스케줄 수정및 새로운스케줄이면 추가 작업
        for (ConcertScheduleDTO i : concertDTO.getSchedulesDtoList()) {
            System.out.println("스케줄아이디"+i.getScheduleId());
            if (i.getScheduleId() == null) {
                ConcertSchedule schedule = new ConcertSchedule();
                schedule.setStartTime(i.getStartTime());
                schedule.setEndTime(i.getEndTime());
                schedule.setTotalSeats(i.getTotalSeats());
                schedule.setStatus(i.getStatus());
                schedule.setConcert(modifiedConcert);
                scheduleRepository.save(schedule);
                System.out.println("새로운 스케줄 생성 했음");
            } else {
                ConcertSchedule originalSchedule = scheduleRepository.findById(i.getScheduleId()).orElseThrow(() -> new RuntimeException("Schedule not found"));
                originalSchedule.setStartTime(i.getStartTime());
                originalSchedule.setEndTime(i.getEndTime());
                originalSchedule.setTotalSeats(i.getTotalSeats());
                originalSchedule.setStatus(i.getStatus());
                originalSchedule.setConcert(modifiedConcert);
                scheduleRepository.save(originalSchedule);
                System.out.println("기존의 스케줄 수정");
            }
        }
        System.out.println("변경된 콘서트정보와 콘서트스케줄을 저장했음");
        // 새로 추가하는 이미지가 있을때
        if (newUploadFileName != null && !newUploadFileName.isEmpty()) {
            System.out.println("새로추가할이미지가 있어서 들어옴");
            if (historyFileName == null || historyFileName.isEmpty()) {
                System.out.println("기존파일없는부분까지는 함");
                // 기존파일은 없는경우 새로 추가
                concertImageRepository.save(ConcertImage.builder()
                        .concert(modifyConcert)
                        .fileName(newUploadFileName)
                        .build());
            } else {
                System.out.println("기존파일있는부분까지는 함");
                // 기존 파일이 있을 경우 디비에서 파일이름 수정 후 원래 있던 실제파일 삭제
                concertImageRepository.updateFileNameByCno(newUploadFileName, modifyConcert.getCNo());
                concertFileUtil.deleteFiles(historyFileName);
            }
        }

        //새로 업로드할 파일은 없고 기존에 있던 이미지파일은 삭제해야할때
        if(concertDTO.getUploadFileName() == null && historyFileName !=null && newUploadFileName == null){
            System.out.println("업로드없고 기존파일삭제부분");
                concertImageRepository.deleteImgInfoByCno(concertDTO.getCno());
                concertFileUtil.deleteFiles(historyFileName);

        }

        return "공연 정보 업데이트가 완료되었습니다.";
    }

    @Override
    public void removeConcert(Long cno) {
        concertRepository.deleteById(cno);
    }

    @Override
    public List<AdminProductDTO> getProductList() {

        return productRepository.findByIsDeletedFalse().stream().map(i ->{
           AdminProductDTO adminProductDTO = new AdminProductDTO();
           adminProductDTO.setPno(i.pNo());
           adminProductDTO.setPname(i.pName());
           adminProductDTO.setPrice(i.pPrice());
           adminProductDTO.setCategory(i.category());

           String imgFileName = imageRepository.findFileNamesByPNo(i.pNo()).stream().findFirst().orElse("");
           adminProductDTO.setImgFileName(imgFileName);

            return adminProductDTO;
        }).toList();
    }

    @Override
    public ProductDTO getProductByPno(Long pno) {
        Product result = productRepository.findById(pno).orElse(null);

        ProductDTO productDTO = modelMapper.map(result,ProductDTO.class);
        productDTO.setUploadFileNames(imageRepository.findFileNamesByPNo(pno));
        return productDTO;
    }

    @Override
    public List<AdminConcertDTO> getConcertList() {
        return concertRepository.findAll().stream().map(i->{
            AdminConcertDTO concertDTO = new AdminConcertDTO();
            concertDTO.setCno(i.getCNo());
            concertDTO.setCname(i.getCName());
            concertDTO.setCprice(i.getCPrice());
            concertDTO.setCategory(i.getCategory());
            concertDTO.setImgFileName(concertImageRepository.findFileNameByCNo(i.getCNo()));
            return concertDTO;
        }).toList();
    }

    @Override
    public ConcertDTO getConcertByCno(Long cno) {
       Concert concert = concertRepository.findById(cno).orElse(null);
        return ConcertDTO.builder()
                .cno(concert.getCNo())
                .cname(concert.getCName())
                .cplace(concert.getCPlace())
                .cdesc(concert.getCdesc())
                .cprice(concert.getCPrice())
                .category(concert.getCategory())
                .uploadFileName(concertImageRepository.findFileNameByCNo(concert.getCNo()))
                .schedulesDtoList( scheduleRepository.getScheduleByCno(concert.getCNo()).stream().map(i->{
                    ConcertScheduleDTO scheduleDTO = new ConcertScheduleDTO();
                    scheduleDTO.setScheduleId(i.getScheduleId());
                    scheduleDTO.setStartTime(i.getStartTime());
                    scheduleDTO.setEndTime(i.getEndTime());
                    scheduleDTO.setTotalSeats(i.getTotalSeats());
                    scheduleDTO.setStatus(i.getStatus());
                    return scheduleDTO;
                }).toList())
                .build();
    }

    @Override
    public List<ProductOrderListDTO> getProductOrderList() {
        List<ProductOrder> productOrderList = productOrderRepository.findAll();
        List<ProductOrderListDTO> ListOfOrderDTO = new ArrayList<>();
        for(ProductOrder i: productOrderList){
            ProductOrderListDTO orderListDTO = new ProductOrderListDTO();
            orderListDTO.setOrderNum(i.getOrderNum());
            orderListDTO.setOrderDate(i.getOrderDate());
            orderListDTO.setStatus(i.getStatus());
            orderListDTO.setUid(i.getUser().uId());
            ListOfOrderDTO.add(orderListDTO);
        }
        return ListOfOrderDTO;
    }

    @Override
    public ProductOrderDetailDTO getProductOrderDetail(Long orderNum) {
        ProductOrder order = productOrderRepository.findById(orderNum).orElse(null);
        List<OrderItem> orderItemList = orderItemRepository.getOrderItemByOrderNum(orderNum);
        List<OrderItemDTO> itemDTOList =  new ArrayList<>();
        ProductOrderDetailDTO orderDetailDTO = new ProductOrderDetailDTO();
        for(OrderItem i : orderItemList){
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setPno(i.getProduct().pNo());
            itemDTO.setPName(i.getProduct().pName());
            itemDTO.setNumOfItem(i.getNumOfItem());
            itemDTOList.add(itemDTO);
        }
        orderDetailDTO.setOrderNum(order.getOrderNum());
        orderDetailDTO.setOrderDate(order.getOrderDate());
        orderDetailDTO.setStatus(order.getStatus());
        orderDetailDTO.setUserDTO(modelMapper.map(order.getUser(), UserDTO.class));
        orderDetailDTO.setShippingAddress(order.getShippingAddress());
        orderDetailDTO.setTrackingNumber(order.getTrackingNumber());
        orderDetailDTO.setNote(order.getNote());
        orderDetailDTO.setTotalPrice(order.getTotalPrice());
        orderDetailDTO.setOrderItemDTOList(itemDTOList);

        return orderDetailDTO;
    }

    @Override
    public void modifyProductOrder(RequestOrderModifyDTO modifyDTO) {
        ProductOrder order = productOrderRepository.findById(modifyDTO.getOrderNum()).orElse(null);
        order.setStatus(modifyDTO.getStatus());
        order.setTrackingNumber(modifyDTO.getTrackingNumber());
        productOrderRepository.save(order);
    }

    @Override
    public List<ConcertTicketListDTO> getConcertTicketList() {
        List<ConcertTicket> ticketList = ticketRepository.findAll();
        List<ConcertTicketListDTO> ticketListDTO =new ArrayList<>();
        for(ConcertTicket i : ticketList){
            ConcertTicketListDTO ticketDto = new ConcertTicketListDTO();
            ticketDto.setId(i.getId());
            ticketDto.setUid(i.getUser().uId());
            ticketDto.setPayment_date(i.getPaymentDate());
            ticketDto.setStatus(i.getStatus());
            ticketDto.setCname(i.getConcertSchedule().getConcert().getCName());
            ticketListDTO.add(ticketDto);
        }
        return ticketListDTO;
    }

    @Override
    public ConcertTicketDetailDTO getConcertTicketDetail(Long id) {
        ConcertTicket ticket = ticketRepository.findById(id).orElse(null);
        return ConcertTicketDetailDTO.builder()
                .id(ticket.getId())
                .userDTO(modelMapper.map(ticket.getUser(), UserDTO.class))
                .scheduleDTO(modelMapper.map(ticket.getConcertSchedule(),ConcertScheduleDTO.class))
                .price(ticket.getPrice())
                .buyerName(ticket.getBuyerName())
                .buyerTel(ticket.getBuyerTel())
                .buyMethod(ticket.getBuyMethod())
                .deliveryMethod(ticket.getDeliveryMethod())
                .paymentDate(ticket.getPaymentDate())
                .shippingAddress(ticket.getShippingAddress())
                .ticketQuantity(ticket.getTicketQuantity())
                .trackingNumber(ticket.getTrackingNumber())
                .status(ticket.getStatus())
                .concertName(ticket.getConcertSchedule().getConcert().getCName())
                .build();
    }

    @Override
    public void modifyConcertTicket(RequestTicketModifyDTO modifyDTO) {
        ConcertTicket ticket = ticketRepository.findById(modifyDTO.getId()).orElse(null);
        if(modifyDTO.getStatus().equals(OrderStatusForConcert.CANCEL_COMPLETED)){

        }
        ticket.setStatus(modifyDTO.getStatus());
        ticket.setTrackingNumber(modifyDTO.getTrackingNumber());
        ticketRepository.save(ticket);
    }

    @Override
    public List<Map<Integer, Long[]>> getStatisticsData(int yearData) {
        // 티켓 월별 매출과 개수를 저장할 맵 초기화
        Map<Integer, Long[]> ticketMonthlyRevenue = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            ticketMonthlyRevenue.put(i, new Long[]{0L, 0L}); // 기본값으로 초기화 [금액, 개수]
        }

        // 주문 월별 매출과 개수를 저장할 맵 초기화
        Map<Integer, Long[]> orderMonthlyRevenue = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            orderMonthlyRevenue.put(i, new Long[]{0L, 0L}); // 기본값으로 초기화 [금액, 개수]
        }

        // 티켓 데이터 처리 - 쿼리에서 이미 월별 SUM과 COUNT를 가져옴
        ticketRepository.findTicketByYear(yearData).forEach(i -> {
            int month = ((Number) i[0]).intValue();
            long amount = ((Number) i[1]).longValue();
            long count = ((Number) i[2]).longValue(); // 쿼리에서 가져온 COUNT 값

            ticketMonthlyRevenue.put(month, new Long[]{amount, count});
        });

        // 주문 데이터 처리 - 쿼리에서 이미 월별 SUM과 COUNT를 가져옴
        productOrderRepository.findOrdersByYear(yearData).forEach(i -> {
            int month = ((Number) i[0]).intValue();
            long amount = ((Number) i[1]).longValue();
            long count = ((Number) i[2]).longValue(); // 쿼리에서 가져온 COUNT 값

            orderMonthlyRevenue.put(month, new Long[]{amount, count});
        });

        List<Map<Integer, Long[]>> responseData = new ArrayList<>();
        responseData.add(ticketMonthlyRevenue);
        responseData.add(orderMonthlyRevenue);
        return responseData;
    }

    @Override
    public List<ResponseProductReviewDTO> getReviewList(Long pno) {


        return productReviewRepository.selectByPNo(pno).stream().map(i->{
            ResponseProductReviewDTO reviewDTO =  new ResponseProductReviewDTO();
            reviewDTO.setProReivewNo(i.getPReviewNo());
            reviewDTO.setReviewtext(i.getReviewtext());
            reviewDTO.setReviewRating(i.getReviewRating());
            reviewDTO.setUserId(i.getUser().userId());
            reviewDTO.setDueDate(i.getDueDate());
            reviewDTO.setPname(i.getProduct().pName());
            return reviewDTO;
        }).toList();

    }

    @Override
    public void deleteReview(Long reviewNo) {
        productReviewRepository.deleteById(reviewNo);
    }

    @Override
    public List<UserDTO> getUserList() {

        return userRepository.findAll().stream().map(i ->{
            return modelMapper.map(i, UserDTO.class);
        }).toList();
    }

    @Override
    public List<ProductRefundListDTO> getProductRefundList() {
        return refundRepository.findAll().stream().map(i->{
            ProductRefundListDTO productRefundListDTO= new ProductRefundListDTO();
            productRefundListDTO.setRefundId(i.getRefundId());
            productRefundListDTO.setStatus(i.getStatus());
            productRefundListDTO.setUserId(i.getUser().userId());
            productRefundListDTO.setOrderNum(i.getProductOrder().getOrderNum());
            return productRefundListDTO;
        }).toList();
    }


}
