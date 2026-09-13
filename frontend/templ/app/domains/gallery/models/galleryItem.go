package models

type PhotoEntity struct {
	Url    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type GalleryItem struct {
	ID          string        `json:"id"`
	Title       string        `json:"title"`
	Style       string        `json:"style"`
	Description string        `json:"description"`
	Photos      []PhotoEntity `json:"photos"`
}

type GalleryResponse struct {
	Content          []GalleryItem `json:"content"`
	Number           int           `json:"number"`
	Size             int           `json:"size"`
	NumberOfElements int           `json:"numberOfElements"`
	TotalElements    int           `json:"totalElements"`
	TotalPages       int           `json:"totalPages"`
	First            bool          `json:"first"`
	Last             bool          `json:"last"`
}
