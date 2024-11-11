import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

// Navbar Container
const Nav = styled.nav`
  padding: 0 20px;
  min-height: 9vh;
  background: #1c2022;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease-in-out;
`;

// Logo Style
const Logo = styled.h1`
  font-size: 25px;
  color: white;
`;

// Menu Style for Desktop
const Menu = styled.ul`
  list-style: none;
  display: flex;

  li:nth-child(2) {
    margin: 0px 20px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Menu Item
const Item = styled.li``;

// Link Style
const Link = styled.a`
  color: white;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    text-decoration: underline;
  }
`;

// Nav Icon (Hamburger Menu)
const NavIcon = styled.button`
  background: none;
  cursor: pointer;
  border: none;
  outline: none;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

// Line style for hamburger icon animation (using Framer Motion)
const Line = styled(motion.div)`
  display: block;
  border-radius: 50px;
  width: 25px;
  height: 3px;
  margin: 5px;
  background-color: #fff;
`;

// Overlay for mobile menu
const Overlay = styled.div`
  position: absolute;
  height: ${(props) => (props.open ? "91vh" : 0)};
  width: 100vw;
  background: #1c2022;
  transition: height 0.4s ease-in-out;
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? "visible" : "hidden")};

  @media (min-width: 769px) {
    display: none;
  }
`;

// Overlay Menu items
const OverlayMenu = styled.ul`
  list-style: none;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  text-align: center;

  li {
    opacity: ${(props) => (props.open ? 1 : 0)};
    font-size: 25px;
    margin: 50px 0px;
    transition: opacity 0.4s ease-in-out;
  }
`;

const Dashboard = () => {
  const [toggle, toggleNav] = useState(false);

  const navItems = [
    "Dashboard",
    "Mentorship Matching",
    "Job & Internship Listings",
    "Messaging System",
    "Event Management",
    "Open Project Collaboration",
    "AI Chatbot",
    "Skill Development Workshops",
    "Resource Recommendations",
    "News & Updates",
    "Alumni Spotlights",
    "Career Pathway Visualization",
  ];

  return (
    <>
      <Nav>
        <Logo>ConnectYou</Logo>
        <Menu>
          {navItems.map((item, index) => (
            <Item key={index}>
              <Link href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
            </Item>
          ))}
        </Menu>
        <NavIcon onClick={() => toggleNav(!toggle)}>
          <Line
            style={{
              transform: toggle ? "rotate(45deg)" : "rotate(0deg)",
              transition: "all 0.3s ease",
            }}
          />
          <Line
            style={{
              opacity: toggle ? "0" : "1",
              transition: "all 0.3s ease",
            }}
          />
          <Line
            style={{
              transform: toggle ? "rotate(-45deg)" : "rotate(0deg)",
              transition: "all 0.3s ease",
            }}
          />
        </NavIcon>
      </Nav>
      <Overlay open={toggle}>
        <OverlayMenu open={toggle}>
          {navItems.map((item, index) => (
            <Item key={index}>
              <Link href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
            </Item>
          ))}
        </OverlayMenu>
      </Overlay>
    </>
  );
};

export default Dashboard;
