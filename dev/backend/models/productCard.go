package models

// This is used only by the frontend to display the product card in the product list
type ProductCard struct {
	Name string

	Rating      string
	RatingCount string

	Price string
}
