import { Container, Row, Col, Card } from "react-bootstrap";

const Profile = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/150" />
            <Card.Body>
              <Card.Title>اسم المستخدم</Card.Title>
              <Card.Text>email@example.com</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h3>معلومات الحساب</h3>
          <p>تفاصيل إضافية عن المستخدم تظهر هنا.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
