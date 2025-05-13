package com.green.project.Leo.dto.product;


import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "files")
public class ProductDTO {

        private Long pno;
        private String pname;
        private String price;
        private String pdesc;
        private int pstock;
        private String category;
        private boolean isDeleted;
        @Builder.Default
        private List<MultipartFile> files =new ArrayList<>();//하나의 상품에 여러개의 이미지를 등록

        @Builder.Default
        private List<String> uploadFileNames = new ArrayList<>();


}
