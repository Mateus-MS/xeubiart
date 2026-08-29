package com.xeubiart.backend.domain.gallery.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @GetMapping("/test")
    public String test() {
        return "olá asdasdasdasdasdddddddddddddddddddd";
    }
}