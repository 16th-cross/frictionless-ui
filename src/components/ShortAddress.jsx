const ShortAddress = ({ address }) => (
  <span>
    {address.substring(0, 4)}...
    {address.substring(address.length - 4, address.length)}
  </span>
);

export default ShortAddress;
