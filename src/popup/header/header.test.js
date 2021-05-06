import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import Header from './header'

describe('Test for Header component', () => {
    describe('Render without crashing', () => {
        it('renders correctly', () => {
            render(<Header />)
            expect(document.querySelector("button").textContent).toContain("Gallery")
        })
    })
})
