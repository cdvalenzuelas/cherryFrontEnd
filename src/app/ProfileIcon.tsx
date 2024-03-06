import styles from './styles.module.css'

interface Props {
  color?: string
}

export const ProfileIcon = ({ color = '#fff' }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 24 24"
    className={styles.buttonIcon}
    strokeWidth={1.5}
  >
    <path
      fill={color}
      strokeWidth={1.5}
      fillRule="evenodd"
      d="m12 3.188 9.45 7.087-.45 1.35h-.75v8.625H3.75v-8.625H3l-.45-1.35L12 3.187Zm-6.75 6.937v8.625h13.5v-8.625L12 5.062l-6.75 5.063Z"
      clipRule="evenodd"
    />
  </svg>
)
