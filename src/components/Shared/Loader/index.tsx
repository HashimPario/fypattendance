import './style.css';

const Loader = () => {
  return (
    <div style={{display: "flex"}}>
      Loading <span className={'dots'}>.</span>
      <span className={'dots'}>.</span>
      <span className={'dots'}>.</span>
    </div>
  );
};

export default Loader;
