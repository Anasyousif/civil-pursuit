import React from 'react'
import Step from '../app/components/step'

export default {
  component: Step,
  args: {
    name: 'Step 2: Rate',
  },
}

export const Primary = { args: { active: true, complete: false } }
export const Secondary = { args: { active: false, complete: true } }
export const Tertiary = { args: { active: false, complete: false } }
export const ParentsWidth = args => {
  return (
    <div style={{ maxWidth: '8.5rem' }}>
      <Step active={true} complete={false} {...args} />
    </div>
  )
}
