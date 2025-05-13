package com.green.project.Leo.controller;

import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.*;
import com.green.project.Leo.repository.product.ProductRepository;
import com.green.project.Leo.service.product.ProductService;
import com.green.project.Leo.util.CustomFileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@Slf4j
@CrossOrigin("http://localhost:3000")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductService service;
    @Autowired
    private CustomFileUtil fileUtil;

    @GetMapping("/list/{category}")
    public PageResponseDTO<ProductDTO> getList(PageRequestDTO dto,@PathVariable(name = "category") String category){
        System.out.println(category);
        System.out.println(dto.getPage());
        return service.getProductList(dto,category);
    }


    @GetMapping("/read/{pno}")
    public ProductReadDTO getProduct(@PathVariable(name = "pno")Long pno){

        return service.getProductByPno(pno);
    }



    @GetMapping("/view/{fileName}") //img src="/view/123445_s송준항.jpg"
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){
        log.info("view"+fileName);
        log.info("이미지파일 보내주고있냐????");
        return fileUtil.getFile(fileName);
    }

    @GetMapping("/getreview/{pno}")
    public List<ResponseProductReviewDTO> getReview(@PathVariable(name = "pno")Long pno){
        return service.getReview(pno);
    }
}
