import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], onAdd }) {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {products.map((p) => (
        <Col key={p.id}>
          <ProductCard product={p} onAdd={onAdd} />
        </Col>
      ))}
    </Row>
  );
}
