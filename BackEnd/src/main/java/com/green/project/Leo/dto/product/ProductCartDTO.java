package com.green.project.Leo.dto.product;

import com.green.project.Leo.dto.user.UserDTO;
import lombok.*;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
public class ProductCartDTO {
    private Long cartNo;
    private UserDTO userDTO;
    private ProductDTO productDTO;
    private int numofItem;
}
