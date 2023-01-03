import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import { useEffect, useState } from 'react';
import Page from '../components/Page';
import Iconify from '../components/common/Iconify';
import { BlogPostCard, BlogPostsSearch } from '../sections/@dashboard/blog';
import { ProductFilterSidebar } from '../sections/@dashboard/products';
import { getAttractions } from '../services/attraction.service';

// mock
import POSTS from '../_mock/blog';


// ----------------------------------------------------------------------

export default function Blog() {
  const [openFilter, setOpenFilter] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAttractions = async (filters, order) => {
    const attractions = await getAttractions({ filters, order });
    if (attractions) setAttractions(attractions?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttractions(); 
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Page title="Dashboard: Blog">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/attraction/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Attraction
          </Button>
        </Stack>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
       
        </Stack> */}
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-start" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            {/* <ProductSort /> */}
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {attractions?.map((attraction, index) => (
            <BlogPostCard key={attraction.id} post={attraction} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
