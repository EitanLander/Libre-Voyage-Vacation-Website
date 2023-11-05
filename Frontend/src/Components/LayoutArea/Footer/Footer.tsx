import "./Footer.css";

function Footer(): JSX.Element {
  const date = new Date();
  const todayYear = date.getFullYear();
  return (
    <div className="Footer">
      <a href="https://www.linkedin.com/in/eitan-lander-b69098278/"> Eitan Lander © {todayYear}</a>
    </div>
  );
}

export default Footer;
