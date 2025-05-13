package com.green.project.Leo.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomConcertFileUtil {

    @Value("${com.green.project.Leo.upload.path2}")
    private String uploadPath;

    @PostConstruct
    public void init(){
        log.info("tomcat server initial ");
        File tempFolder =new File(uploadPath);
        if(tempFolder.exists()==false) tempFolder.mkdir();// 폴더가 없으면 새로 생성
        uploadPath =tempFolder.getAbsolutePath();
        log.info("===========================");
        log.info(uploadPath);
    }
    //pdf page7
    public String saveFiles(MultipartFile file) throws RuntimeException{
           if(file==null || file.isEmpty()) return null;
         String savedName = UUID.randomUUID().toString()+"_"+file.getOriginalFilename();
         Path savePath = Paths.get(uploadPath,savedName);
         try {
             Files.copy(file.getInputStream(), savePath);
             String contentType = file.getContentType();
             if(contentType!=null && contentType.startsWith("image")){
                 Path thumbnailPath = Paths.get(uploadPath,"s_"+savedName);
                 Thumbnails.of(savePath.toFile()).size(200,200).toFile(thumbnailPath.toFile());
             }
         }catch (IOException e){
             throw new RuntimeException(e.getMessage());
         }
         return savedName;
       }
    //업로드 파일 보여주기
    //이미지를 db에 저장하지 않고 file server에 저장하고 db에는 파일 서버의 경로저장
    public ResponseEntity<Resource> getFile(String fileName){
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        if(!resource.exists()) resource= new FileSystemResource(uploadPath+File.separator+"default.png");
        HttpHeaders headers=new HttpHeaders();
        try {
            //probeContentType probe(조사하다) ContentType 을
            headers.add("Content-Type",Files.probeContentType(resource.getFile().toPath()));
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }


    public void deleteFiles(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }
        String thumbnailFileName = "s_" + fileName;
        Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
        Path filePath = Paths.get(uploadPath, fileName);
        try {
            System.out.println("삭제했니?");
            // 파일이 존재하면 삭제
            Files.deleteIfExists(filePath);
            Files.deleteIfExists(thumbnailPath); // 썸네일 파일도 존재하면 삭제
        } catch (IOException e) {
            // 예외 메시지와 함께 로그를 남겨서 문제를 추적할 수 있게 합니다.
            log.error("파일 삭제 실패: 파일명 = {}, 썸네일 파일명 = {}", fileName, thumbnailFileName, e);
            throw new RuntimeException("파일 삭제 중 오류 발생: " + e.getMessage());
        }
    }
}
