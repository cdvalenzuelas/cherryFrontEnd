import styles from './styles.module.css'

interface Props {
  color?: string
}

export const ScheduleIcon = ({ color = '#fff' }: Props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    data-name='Flat Line'
    viewBox='0 0 24 24'
    className={styles.buttonIcon}
    strokeWidth={1.5}
  >
    <path
      d='m3 15 7 1-1 5h11a1 1 0 0 0 1-1V9H3Z'
      style={{
        fill: 'none'
      }}
    />
    <path
      d='m10 16-1 5-6-6ZM3 5v10l6 6h11a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Zm0 0v4h18V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Zm4-2v2m5-2v2m5-2v2'
      stroke={color}
      style={{
        fill: 'none',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
    />
  </svg>
)
