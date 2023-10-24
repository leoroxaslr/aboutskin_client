import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer p-10 bg-neutral text-white">
        <aside>
          <p className="text-3xl font-bold text-base-100">
            Aboutskin PH
            <br />
          </p>
          <p> Providing affordable skin care since 2020</p>
        </aside>
        <nav>
          <header className="footer-title">Customer Care</header>
          <a className="link link-hover">Delivery</a>
          <a className="link link-hover">FAQ</a>
          <a className="link link-hover">Contact Us</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <header className="footer-title">About US </header>
          <a className="link link-hover">About Skin PH</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Pivacy Policy</a>
          <a className="link link-hover" href="https://shopee.ph/about_skin">
            Shopee
          </a>
        </nav>
        <nav>
          <header className="footer-title">Legal</header>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
