package com.green.project.Leo.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.green.project.Leo.dto.admin.concert.AdminConcertDTO;
import com.green.project.Leo.dto.admin.concert.ConcertTicketDetailDTO;
import com.green.project.Leo.dto.admin.concert.ConcertTicketListDTO;
import com.green.project.Leo.dto.admin.concert.RequestTicketModifyDTO;
import com.green.project.Leo.dto.admin.payment.*;
import com.green.project.Leo.dto.admin.product.AdminProductDTO;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.ResponseProductReviewDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.service.Admin.AdminService;
import com.green.project.Leo.service.payment.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;
@PreAuthorize("hasRole('ADMIN')")
@RestController
@Slf4j
@RequestMapping("/admin")
@CrossOrigin("http://localhost:3000")
public class AdminController {
    @Autowired
    private AdminService service;

    @Autowired
    private PaymentService paymentService;
    @PostMapping("/add/product")
    public String addProduct(@ModelAttribute ProductDTO productDTO){
        log.info("add로 들어옴"+productDTO);
        service.addProduct(productDTO);
        return "성공";

    }
    @PostMapping(value = "/add/concert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String addConcert(
            @RequestPart("concertDTO") ConcertDTO concertDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // file 파트가 있으면, ConcertDTO 내의 file 필드에 수동 할당하거나 별도로 처리할 수 있음
        concertDTO.setFile(file);

        return service.addConcert(concertDTO);
    }
    @PutMapping("/modify/product")
    public String modifyProduct(@ModelAttribute ProductDTO productDTO){
        service.updateProduct(productDTO);
        return "정상적으로 수정을 완료하였습니다";
    }

    @DeleteMapping("/remove/product/{pno}")
    public String removeProduct(@PathVariable(name = "pno")Long pno){
        service.removeProduct(pno);
        return "삭제성공";
    }

    @PutMapping(value = "/modify/concert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> modifyConcert(
            @RequestPart("concertDTO")ConcertDTO concertDTO,
            @RequestPart(value = "deleteId", required = false) String deleteScheduleIdJson,
            @RequestPart(value = "file",required = false) MultipartFile file) throws JsonProcessingException {
        concertDTO.setFile(file);
        try {
            List<Long> deleteScheduleIds = new ObjectMapper().readValue(deleteScheduleIdJson, new TypeReference<List<Long>>() {});
            String msg = service.updateConcert(concertDTO, deleteScheduleIds);
            return ResponseEntity.ok(msg);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove/concert/{cno}")
    public String removeConcert(@PathVariable(name = "cno")Long cno){
            service.removeConcert(cno);
        return "삭제성공";
    }

    @GetMapping("/product/list")
    public List<AdminProductDTO> getProductList(){

        return service.getProductList();
    }

    @GetMapping("/product/read/{pno}")
    public ProductDTO getProductByPno(@PathVariable(name = "pno") Long pno){


        return service.getProductByPno(pno);

    }

    @GetMapping("/concert/list")
    public List<AdminConcertDTO> getConcertList(){

        return service.getConcertList();
    }
    @GetMapping("/concert/read/{cno}")
    public ConcertDTO getConcertByCno(@PathVariable(name = "cno") Long cno){

        return service.getConcertByCno(cno);
    }

    @GetMapping("/product/order/list")
    public List<ProductOrderListDTO> getProductOrderList(){
          return  service.getProductOrderList();
    }

    @GetMapping("/product/order/detail/{orderNum}")
    public ProductOrderDetailDTO getProductOrderDetail(@PathVariable(name = "orderNum")Long orderNum){
        return service.getProductOrderDetail(orderNum);
    }

    @PutMapping("/product/order/modify")
    public String modifyProductOrder(@RequestBody RequestOrderModifyDTO modifyDTO){
        System.out.println("모디파이 ");
        service.modifyProductOrder(modifyDTO);
        return "상태 업데이트를 완료하였습니다";
    }

    @GetMapping("/concert/ticket/list")
    public List<ConcertTicketListDTO> getConcertTicketList(){
        return service.getConcertTicketList();
    }

    @GetMapping("/concert/ticket/detail/{ticketId}")
    public ConcertTicketDetailDTO getConcertTicketDetail(@PathVariable(name = "ticketId")Long id){

        return service.getConcertTicketDetail(id);

    }

    @PutMapping("/concert/ticket/modify")
    public String modifyConcertTicket(@RequestBody RequestTicketModifyDTO modifyDTO){
            service.modifyConcertTicket(modifyDTO);
        return "티켓 상태를 성공적으로 업데이트 하였습니다";
    }
    @GetMapping("/statistics/{year}")
    public  List<Map<Integer, Long[]>> getStatistics(@PathVariable(name = "year") int yearData){
        return service.getStatisticsData(yearData);
    }

    @GetMapping("/review/list/{pno}")
    public List<ResponseProductReviewDTO> getReviewList(@PathVariable(name = "pno") Long pno){
          return service.getReviewList(pno);
    }
    @DeleteMapping("/review/remove/{reviewNo}")
    public void deleteReview(@PathVariable(name = "reviewNo")Long reviewNo){
        service.deleteReview(reviewNo);
    }

    @GetMapping("/user/list")
    public List<UserDTO> getUserList(){
        return service.getUserList();
    }

    @GetMapping("/product/refund/list")
    public List<ProductRefundListDTO> getProductRefundList(){
        return service.getProductRefundList();
    }

    @GetMapping("/product/refund/{refundId}")
    public ProductRefundDetailDTO getProductRefundDetail(@PathVariable(name = "refundId")Long refundId){

      return  paymentService.getRefundDetail(refundId);
    }

    @PutMapping("/product/refund/approve")
    public ResponseEntity<?> approveProductRefund(@RequestBody RefundApprovalRequestDTO refundApprovalRequestDTO){

        return paymentService.approveProductRefund(refundApprovalRequestDTO);
    }

    @PutMapping("/product/refund/reject")
    public ResponseEntity<?> rejectProductRefund(@RequestBody RefundRejectRequestDTO refundRejectRequestDTO){

        return paymentService.rejectProductRefund(refundRejectRequestDTO.getRefundId(),refundRejectRequestDTO.getReason());
    }
}
