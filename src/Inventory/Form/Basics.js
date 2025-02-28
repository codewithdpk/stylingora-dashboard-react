import React, { useCallback, useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { getAllCategories } from "../../services/getCategories";
import { getAllCollections } from "../../services/getCollections";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "ApercuMedium",
  },
  formControl: {
    minWidth: 120,
    marginTop: theme.spacing(2),
  },
}));

export default function Basics(props) {
  const classes = useStyles();
  const { setProduct, product, setStock, stock } = props;
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [collections,setCollections] = useState([])
  const [categories,setCategories] = useState([])

  const handleChangeProductDetails = (event) => {
    event.persist();
    setProduct((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleSelectCollection = (event)=>{
    event.persist();
    const filterList = collections.filter(item=>item.id === event.target.value )
    setProduct((prevState) => {
      return { ...prevState, collectionId: event.target.value, collection:filterList[0].title};
    });
  }
  const handleSelectCategory = (event)=>{
    event.persist();
    const filterList = categories.filter(item=>item.id === event.target.value )
    setProduct((prevState) => {
      return { ...prevState, categoryId: event.target.value, category:filterList[0].title};
    });
  }

  const handleChangeStock = (event) => {
    event.persist();
    setStock((prevState) => {
      return { ...prevState, [event.target.name]: Number(event.target.value) };
    });
  };

  const handleChecked = (event)=>{
    event.persist();

    setProduct((prevState) => {
      return { ...prevState,returnAndExchange : event.target.checked };
    });
  }

  const getList = useCallback(async()=>{
    const listOfCategory = await getAllCategories()
    if(listOfCategory.categories)setCategories(listOfCategory.categories)
    const listOfCollections = await getAllCollections()
    if(listOfCollections.collections) setCollections(listOfCollections.collections)
  },[])

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
    getList()
  }, []);

  return (
    <Grid container className={classes.grid} spacing={4}>
      <Grid item className={classes.box} xs={6} sm={6} md={6} lg={6}>
        <Grid item xs={12}>
          <TextField
            id="outlined-name"
            label="Product Title"
            margin="normal"
            variant="outlined"
            fullWidth
            value={product.title}
            name="title"
            onChange={handleChangeProductDetails}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows="4"
            value={product.description}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            fullWidth
            name="description"
            onChange={handleChangeProductDetails}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Highlights"
            value={product.highlights}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            fullWidth
            style={{ marginBottom: 0 }}
            name="highlights"
            onChange={handleChangeProductDetails}
          />
          <Typography variant="caption" style={{ fontSize: "10px" }}>
            Comma(,) seprated string
          </Typography>
        </Grid>
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={3}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                Category
              </InputLabel>
              <Select
                value={product.categoryId}
                labelWidth={labelWidth}
                inputProps={{
                  name: "category",
                  id: "outlined-category-simple",
                }}
                name="category"
                onChange={handleSelectCategory}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
               {categories.map(category=><MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                Collection
              </InputLabel>
              <Select
                value={product.collectionId}
                labelWidth={labelWidth}
                inputProps={{
                  name: "collection",
                  id: "outlined-category-simple",
                }}
                name="collection"
                onChange={handleSelectCollection}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
               {collections.map(collection=><MenuItem key={collection.id} value={collection.id}>{collection.title}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.box} xs={6} sm={6} md={6} lg={6}>
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={3}>
          <Grid item xs={3}>
          <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                Currency
              </InputLabel>
              <Select
                value={product.currency}
                labelWidth={labelWidth}
                inputProps={{
                  name: "currency",
                  id: "outlined-category-simple",
                }}
                name="currency"
                onChange={handleChangeProductDetails}
              >
                <MenuItem value="INR">
                  INR
                </MenuItem>
              </Select>
            </FormControl> 
          </Grid>

          <Grid item xs={7} sm={7} md={7} lg={7}>
          <TextField
                id="outlined-multiline-static"
                label="MRP Price"
                value={product.price}
                onChange={handleChangeProductDetails}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                type="text"
                InputProps={{
                  inputProps: { min: 1 },
                }}
                name="mrpPrice"
              />
          </Grid>

          <Grid item xs={7} sm={7} md={7} lg={7}>
          <TextField
                id="outlined-multiline-static"
                label="Selling Price"
                value={product.price}
                onChange={handleChangeProductDetails}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                type="text"
                InputProps={{
                  inputProps: { min: 1 },
                }}
                name="sellingPrice"
              />
          </Grid>


        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" style={{ marginBottom: ".5em" }}>
            Available Sizes
          </Typography>
          <Grid item container xs={12} sm={12} md={12} lg={12} spacing={2}>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="XS"
                value={stock.XS}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="XS"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="SM"
                value={stock.S}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="S"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="MD"
                value={stock.M}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="M"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="LG"
                value={stock.L}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="L"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="XL"
                value={stock.XL}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="XL"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                id="outlined-multiline-static"
                label="XXL"
                value={stock.XXL}
                onChange={handleChangeStock}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                style={{ marginTop: 0 }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                name="XXL"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item >
        <FormControlLabel
            control={
              <Checkbox checked={product.returnAndExchange} onChange={handleChecked} color="primary" />
            }
            label="Return and Exchange"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
