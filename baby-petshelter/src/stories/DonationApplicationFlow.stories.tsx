import type { Meta, StoryObj } from '@storybook/react-vite'
import { DonationApplicationFlow } from './DonationApplicationFlow'

const meta = {
  title: 'Pet Shelter/Donation Application Flow',
  component: DonationApplicationFlow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DonationApplicationFlow>

export default meta

type Story = StoryObj<typeof meta>

export const Prototype: Story = {}
