import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdoptionHomePrototype } from './AdoptionHomePrototype'

const meta = {
  title: 'Pet Shelter/Adoption Home Prototype',
  component: AdoptionHomePrototype,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdoptionHomePrototype>

export default meta

type Story = StoryObj<typeof meta>

export const Prototype: Story = {}
