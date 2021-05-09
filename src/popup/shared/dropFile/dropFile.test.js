import '@babel/polyfill'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import DropFile from '.'

describe('Test for DropFile component', () => {
  describe('Render without crashing', () => {
    let dropZone, importDescription, container, props, file, decor

    beforeEach(() => {
      props = {}
      const obj = render(<DropFile />)
      container = obj.container
      dropZone = container.getElementsByClassName('dropzone')[0]
      importDescription = container.getElementsByClassName('import-description')[0]
      decor = container.getElementsByClassName('decorator')[0]

      file = new File(['Foo'], 'chucknorris.json', { type: 'json' })
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })

    // it('accepts JSON file only', async () => {
    //   expect(importDescription.textContent).toEqual('Drag & drop an existing .JSON wallet file here or click to browse your computer')
    //   fireEvent.drop(screen.getByText(/Drop/i), {
    //     dataTransfer: {
    //       files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
    //     },
    //   })
      

    //   expect(importDescription.textContent).toEqual('Drop to import file.')
    // })
  })
})
