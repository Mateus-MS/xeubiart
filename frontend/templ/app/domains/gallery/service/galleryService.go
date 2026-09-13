package service

import (
	"fmt"

	"com.xeubiart/app/domains/gallery/models"
	"com.xeubiart/app/router"
)

type GalleryService struct {
	httpClient *router.HTTPClient
}

func New(httpClient *router.HTTPClient) *GalleryService {
	return &GalleryService{
		httpClient: httpClient,
	}
}

func (s *GalleryService) GetGallery(page int) (*models.GalleryResponse, error) {
	resp := models.GalleryResponse{}

	err := s.httpClient.Get(
		fmt.Sprintf("http://localhost:8080/api/works?page=%d&size=12", page),
		&resp,
	)

	if err != nil {
		return nil, err
	}

	return &resp, nil
}
