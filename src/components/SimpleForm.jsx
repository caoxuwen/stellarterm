const React = window.React = require('react');

// a basic form
const SimpleForm = ({ status, message, className, style, onSubmitted }) => {
  let input;
  const submit = () =>
    input &&
    input.value.indexOf("@") > -1 &&
    onSubmitted({
      EMAIL: input.value
    });

  return (
    <div className="HomePage__lead__subscribe_container" style={style}>
      <div className="HomePage__lead__subscribe_container_inner">
        <span className="HomePage__lead__subscribe_detail">Get early access to beta, join our wait list</span>
        <input
          ref={node => (input = node)}
          type="email"
          placeholder="&nbsp;&nbsp;Your email"
          className="s-inputGroup__item HomePage__lead__subscribe_input"
        />
        <button onClick={submit} className="s-button">Join</button>
        {status === "sending" && <div className="HomePage__lead__subscribe_status">sending...</div>}
        {status === "error" && (
          <div className="HomePage__lead__subscribe_status"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
        {status === "success" && (
          <div className="HomePage__lead__subscribe_status"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleForm;