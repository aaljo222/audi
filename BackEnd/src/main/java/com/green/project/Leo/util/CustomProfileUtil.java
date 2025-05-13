package com.green.project.Leo.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomProfileUtil {

    @Value("${com.green.project.Leo.upload.path3}")
    private String uploadPath; // 절대경로로 변환된 실제 저장 경로

    @PostConstruct
    public void init() {
        File folder = new File(uploadPath);
        if (!folder.exists()) folder.mkdirs();
        uploadPath = folder.getAbsolutePath(); // 절대 경로 저장
        log.info("프로필 이미지 저장 폴더 경로: {}", uploadPath);
    }

    // 프로필 이미지를 저장하는 메소드
    public String saveProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "default.png";  // 파일이 없으면 기본 이미지로 설정
        }

        // 파일 확장자 검사 (이미지 파일만 허용)
        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new RuntimeException("잘못된 파일 형식입니다.");
        }

        String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase(); // 확장자 추출 후 소문자 처리

        // 허용된 이미지 확장자 목록
        List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png");

        if (!allowedExtensions.contains(ext)) {
            throw new RuntimeException("이미지 파일만 업로드 가능합니다.");
        }

        try {
            String newFileName = UUID.randomUUID() + ext;  // 고유한 UUID를 파일명에 적용
            Path savePath = Paths.get(uploadPath, newFileName);
            log.info("프로필 이미지 저장 경로: {}", savePath.toString());
            Files.copy(file.getInputStream(), savePath);  // 파일을 지정된 경로에 저장

            return newFileName;  // 저장된 새로운 파일명 반환
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 저장 실패: " + e.getMessage());
        }
    }

    public void deleteProfileImage(String fileName) {
        if (fileName == null || fileName.isBlank()) return;

        Path path = Paths.get(uploadPath, fileName);
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("프로필 이미지 삭제 실패: {}", e.getMessage());
        }
    }

    public ResponseEntity<Resource> getProfileImage(String fileName) {
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        if (!resource.exists()) {
            resource = new FileSystemResource(uploadPath + File.separator + "default.png");
        }

        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
