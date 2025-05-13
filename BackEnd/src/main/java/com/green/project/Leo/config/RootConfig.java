package com.green.project.Leo.config;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//스프링에서 관리하는 환경설정
@Configuration
public class RootConfig {

    //자바의 객체 (커피이름)
    @Bean
    public ModelMapper getMapper(){
        ModelMapper modelMapper= new ModelMapper();
        modelMapper.getConfiguration().setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.LOOSE);
        return  modelMapper;
    }
    //위의 코드는외우지마시고 정형화되어 있다가져다 쓴다
}