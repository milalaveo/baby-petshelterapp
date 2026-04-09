import type { Meta, StoryObj } from '@storybook/react-vite'
import { PetShelterPlayground } from './PetShelterPlayground'

const meta = {
  title: 'Pet Shelter/Prototypes',
  component: PetShelterPlayground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    prototype: 'intake',
  },
  argTypes: {
    prototype: {
      control: false,
    },
  },
} satisfies Meta<typeof PetShelterPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const IntakeBoard: Story = {
  args: {
    prototype: 'intake',
  },
}

export const AdoptionMatchmaker: Story = {
  args: {
    prototype: 'adoption',
  },
}

export const VolunteerShiftBoard: Story = {
  args: {
    prototype: 'volunteer',
  },
}
