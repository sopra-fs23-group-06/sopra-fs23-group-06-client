import "styles/ui/Card.scss";

const Card = (props) => (
  <div
    className={`card ${props.className}`}
    style={props.style}
    onClick={props.onClick}
  >
    {props.children}
    <img
      className="card image"
      src={require(`styles/images/cards/${props.path}.png`)}
      alt="card front"
      width="150"
      height="150"
    />
  </div>
);

export default Card;
