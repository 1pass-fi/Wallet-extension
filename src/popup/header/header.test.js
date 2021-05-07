import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'


import Header from './header'

import { BrowserRouter as Router } from 'react-router-dom';

describe('Test for Header component', () => {
    describe('Render without crashing', () => {

        const { location } = window

        beforeAll(() => {
            delete window.location;
            window.location = { reload: jest.fn() };
        })

        afterAll(() => {
            window.location = location;
        })

        it('renders correctly', () => {

            window.location.href = "http://localhost/accounts"
            const { container } = render(<Router><Header /></Router>)
            expect(container.querySelector("button").textContent).toContain("Gallery")

            const [accounts, assets, activity] = container.querySelectorAll("a")

            expect(accounts.textContent).toContain("Accounts")
            expect(assets.textContent).toContain("Assets")
            expect(activity.textContent).toContain("Activity")

            expect(accounts.firstChild.className).toEqual("nav-item-active")
        })
    })
})
