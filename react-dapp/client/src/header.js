import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const Header = () => {
	// main Header of the page
	return (
		<>
			<Container>
				<Row className="row d-print-none mt-4">
                    <Col className="d-none d-lg-block mt-2">
						<img
							src={'images/logo2.png'}
							alt="logo"
							height={'80px'}
							className="float-right"
						/>
					</Col>
                    <Col>
						<img
							src={'images/IIIT-Delhi.png'}
							alt="IIIT-Delhi"
							className="img-fluid"
						/>
					</Col>
					
				</Row>
			</Container>
			<br />
		</>
	);
};

export default Header;