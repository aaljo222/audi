package com.green.project.Leo.service.product;

import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.*;


import java.util.List;

public interface ProductService {
    public ProductReviewRatingDTO selectReview(Long pno);
    public PageResponseDTO<ProductDTO>  getProductList(PageRequestDTO dto,String category);
    public ProductReadDTO getProductByPno(Long pno);
    public List<ResponseProductReviewDTO> getReview(Long pno);
    public void addReview(RequestProductReviewDTO reviewDTO);
}
