import type { Meta, StoryObj } from '@storybook/react-vite'
import { PreviewOnlyNotice } from './PreviewOnlyNotice'

const meta = {
  title: 'Pet Shelter/Preview Only Notice',
  component: PreviewOnlyNotice,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PreviewOnlyNotice>

export default meta

type Story = StoryObj<typeof meta>

export const Prototype: Story = {}
