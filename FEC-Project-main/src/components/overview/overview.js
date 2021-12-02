import React from 'react'
import Images from './images.js'
import ProductInfo from './productInfo.js'
import StyleSelector from './styleSelector.js'
import Cart from './cart.js'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import ProductSelector from './productSelector.js'

export default function Overview(props) {
  return(
    <div >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Images />
          </Grid>
          <Grid item xs={12} md={3} container spacing={0} direction="column">
            <Grid item xs={1}>
              <ProductInfo />
            </Grid>
            <Grid item xs={1}>
              <StyleSelector />
            </Grid>
            <Grid item xs={1}>
              <Cart />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <div>
        <ProductSelector />
      </div>
    </div>
  )
}
