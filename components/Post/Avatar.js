export default function ProfilePic({
  alt = "",
  src,
  styles = {},
  size = 35,
  ...props
}) {
  return (
    <img
      {...props}
      loading="lazy"
      alt={alt}
      src={src}
      height={size}
      width={size}
      style={{ borderRadius: 99999, ...styles }}
    />
  );
}
