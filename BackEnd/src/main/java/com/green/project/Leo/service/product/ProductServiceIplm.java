package com.green.project.Leo.service.product;

import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.*;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.repository.user.UserRepository;
import com.green.project.Leo.repository.product.*;
import com.green.project.Leo.util.CustomFileUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceIplm implements ProductService{
    @Autowired
    private ProductOrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomFileUtil fileUtil;
    @Autowired
    private ProductImageRepository imageRepository;
    @Autowired
    private ProductReviewRatingRepository reviewRatingRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductCartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductReviewRepository reviewRepository;


    @Override
    public ProductReviewRatingDTO selectReview(Long pno) {
        Optional<ProductReviewRating> result = reviewRatingRepository.reviewRatingByPno(pno);
        System.out.println(result.orElseThrow());
        ProductReviewRating rating = result.orElseThrow();
        return new ProductReviewRatingDTO(rating.getPNo(),rating.getAvgRating(),rating.getReviewCount());
    }

    @Override
    public PageResponseDTO<ProductDTO> getProductList(PageRequestDTO dto,String category) {

        Pageable pageable = PageRequest.of(
                dto.getPage()-1,
                dto.getSize(),
                Sort.by("pNo").descending()
        );
        Page<Product> result;

        if (category == null || category.equals("전체")) {

            result = productRepository.findByIsDeletedFalse(pageable);
        } else {
            // 특정 카테고리만 필터링하여 조회

            result = productRepository.findByCategoryAndIsDeletedFalse(category, pageable);
        }

        List<ProductDTO> productDTOList = new ArrayList<>();
        for(Product i : result){
            List<String> imageList = imageRepository.findFileNamesByPNo(i.pNo());
            ProductDTO productDTO = ProductDTO.builder()
                    .pno(i.pNo())
                    .pname(i.pName())
                    .pdesc(i.pdesc())
                    .price(i.pPrice())
                    .pstock(i.pStock())
                    .uploadFileNames(imageList)
                    .category(i.category())
                    .build();
            productDTOList.add(productDTO);

        }
        long totalCount = result.getTotalElements();
        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(productDTOList)
                .totalCount(totalCount)
                .pageRequestDTO(dto)
                .build();
    }

    @Override
    public ProductReadDTO getProductByPno(Long pno) {
        Product result = productRepository.findById(pno).orElseThrow();
        List<String> imamgeList = imageRepository.findFileNamesByPNo(result.pNo());
        ProductReviewRating reviewrating = reviewRatingRepository.reviewRatingByPno(pno).orElse(null);
        ProductDTO productDTO = ProductDTO.builder()
                .pno(result.pNo())
                .isDeleted(result.isDeleted())
                .pname(result.pName())
                .price(result.pPrice())
                .pdesc(result.pdesc())
                .pstock(result.pStock())
                .uploadFileNames(imamgeList)
                .build();
        if (reviewrating == null) {
            ProductReviewRatingDTO reviewDTO = ProductReviewRatingDTO.builder()
                    .pno(0L)
                    .reviewcount(0)
                    .avgrating((double) 0)
                    .build();
            return ProductReadDTO.builder().reviewRatingDTO(reviewDTO).productDTO(productDTO).build();
        }else {
            ProductReviewRatingDTO reviewDTO = ProductReviewRatingDTO.builder()
                    .pno(reviewrating.getPNo())
                    .reviewcount(reviewrating.getReviewCount())
                    .avgrating(reviewrating.getAvgRating())
                    .build();
            return ProductReadDTO.builder().reviewRatingDTO(reviewDTO).productDTO(productDTO).build();
        }
    }


    @Override
    public List<ResponseProductReviewDTO> getReview(Long pno) {
        List<ProductReview> reviewList = reviewRepository.selectByPNo(pno);
        List<ResponseProductReviewDTO> reviewDTOList = new ArrayList<>();
        for(ProductReview i: reviewList){
            ResponseProductReviewDTO dto = ResponseProductReviewDTO.builder()
                    .proReivewNo(i.getPReviewNo())
                    .reviewRating(i.getReviewRating())
                    .userId(i.getUser().userId())
                    .reviewtext(i.getReviewtext())
                    .dueDate(i.getDueDate())
                    .build();
            reviewDTOList.add(dto);
        }
       return reviewDTOList;
    }

    @Override
    public void addReview(RequestProductReviewDTO reviewDTO) {

        Product product = new Product();
        product.pNo(reviewDTO.getPno());

        User user = new User();
        user.uId(reviewDTO.getUid());

        ProductOrder order = new ProductOrder();
        order.setOrderNum(reviewDTO.getOrderNum());

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setProductOrder(order);
        review.setReviewtext(reviewDTO.getReviewtext());
        review.setDueDate(LocalDate.now());
        review.setReviewRating(reviewDTO.getReviewRating());

        reviewRepository.save(review);
    }


}
