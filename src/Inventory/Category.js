import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import SearchIcon from "@material-ui/icons/Search";
import AddCategory from "./AddCategory";
import PageTitle from "./../Common/PageTitle";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { getAllCategories } from "../services/getCategories";
import updateCategory from "../services/updateCategory";
import { enqueueSnackbar } from "notistack";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import deleteCategory from "../services/deleteCategory";
import { uuidv4 } from "../utils/uuid";
import { CustomButton } from "../Common/CustomButton";
import addSubCategory from "../services/addSubcategory";
import { getSubCategories } from "../services/getSubcategories";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: 0,
    top: "auto",
    left: "auto",
    position: "fixed",
    bottom: theme.spacing(7),
    right: theme.spacing(7),
  },
  action: {
    marginLeft: "auto",
    marginTop: "0.8rem",
    marginRight: theme.spacing(2),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  createProductModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[5],
    boxShadow: "0 20px 60px -2px rgba(27,33,58,.4)",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    borderRadius: "8px",
  },
  emptyIcon: {
    color: "#00000032",
    fontSize: "10em",
  },
  emptyContainer: {
    marginTop: "25vh",
  },
  title: {
    fontFamily: "ApercuMedium",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
  },
  button2: {
    boxShadow: "none",
    fontFamily: "ApercuMedium",
  },
  toolbar: {
    // boxShadow: '0 0 1px 0 rgba(0,0,0,.22)',
    boxShadow: "0 0 11px #eaf0f6",
    display: "inline-block",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  lastUpdated: {
    marginTop: theme.spacing(2),
    padding: 0,
    color: "rgb(112, 117, 122)",
  },
}));

const Category = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [addCategoryModal, setAddCategoryModal] = React.useState(false);
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editableCategory, setEditableCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const [subCategory, setSubCategory] = useState({})

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openAddCategoryModal = () => {
    setAddCategoryModal(true);
  };

  const closeAddCategory = () => {
    setAddCategoryModal(false);
    setEdit(false);
    setEditableCategory(null);
  };

  const handleEdit = (category) => {
    setEditableCategory(category);
    setEdit(true);
    openAddCategoryModal();
  };

  const handleUpdateCategory = async (category) => {
    if (category.title.length > 2) {
      const response = await updateCategory(category);
      enqueueSnackbar(response.message, {
        variant: response.success ? "success" : "error",
      });
      if (response.success) {
        getCategoryList();
      }
    } else {
      enqueueSnackbar(
        "Collection length should be greater or equal 3 character",
        {
          variant: "error",
        }
      );
    }
  };

  const toggleCategoryEnable = (category) => {
    const newCategory = { ...category, enabled: !category.enabled };
    handleUpdateCategory(newCategory);
  };

  const getCategoryList = useCallback(async () => {
    setLoading(true);
    const listOfCategory = await getAllCategories();
    if (listOfCategory.categories) {

      const subCatsPromises = listOfCategory.categories.map((cat) => {
        return getSubCategories(cat.id)
      })

      Promise.all([...subCatsPromises]).then((data) => {
        let allSubCats = []
        data.forEach((d) => {
          if (d.success) {
            allSubCats = [...allSubCats, ...d.subCategories]
          }
        })

        const mappedCategories = listOfCategory.categories.map((cat) => {
          return { ...cat, subs: allSubCats.filter((subCat) => subCat.parentCatId === cat.id) }
        })

        setCategoryList(mappedCategories);
      })



    }
    setLoading(false);
  }, []);

  const handleDeleteCategory = async (id) => {
    const response = await deleteCategory(id);
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
    });
    if (response.success) {
      getCategoryList();
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  function handleOpenSubCategory(catId, catName) {
    setOpenSubCategoryModal(true)
    setSubCategory({ id: uuidv4(), parentCatId: catId, parentCatName: catName, title: "" })
  }

  function handleCloseSubCategory() {
    setOpenSubCategoryModal(false)
    setSubCategory({})
  }

  async function handleAddSubCat() {
    if (subCategory.title.trim().length !== 0) {
      setLoading(true)
      const res = await addSubCategory(subCategory)
      if (res.success) {
        enqueueSnackbar(res.message, { variant: 'success' })
      } else {
        enqueueSnackbar(res.message, { variant: 'errpr' })

      }
      setLoading(false)
      handleCloseSubCategory()
    } else {
      enqueueSnackbar("Please provide the valid name", { variant: 'error' })
    }
  }


  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Card
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <Box style={{ display: "flex" }}>
            <PageTitle title="Category" />
            <div
              className={classes.action}
              style={{ marginTOp: 0, lineHeight: 6 }}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.button2}
                style={{ marginRight: "1em" }}
                onClick={openAddCategoryModal}
              >
                Add Category
              </Button>
            </div>
          </Box>

          <Grid container spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Sub Categories
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Enabled</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  categoryList.length > 0 &&
                  categoryList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, _index) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.title}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell> {category.subs.map((subCat) => {
                          return <Chip key={subCat.id} label={subCat.title} />
                        })} </TableCell>
                        <TableCell>
                          {
                            <Switch
                              checked={category.enabled}
                              color="primary"
                              onClick={() => toggleCategoryEnable(category)}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          <Box style={{ display: "flex" }}>
                            <Button color="primary" variant="outlined" onClick={() => handleOpenSubCategory(category.id, category.title)}>
                              Subcategory +
                            </Button>
                            <IconButton onClick={() => handleEdit(category)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteCategory(category.id)}
                              style={{ color: "red" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100]}
              component="div"
              count={categoryList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              sx={{ color: "text.secondary" }}
            />
          </Grid>
        </Card>
      </Container>

      <Zoom
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        in={true}
        unmountOnExit
      >
        <Fab
          color="primary"
          className={classes.fab}
          onClick={openAddCategoryModal}
        >
          <SearchIcon />
        </Fab>
      </Zoom>

      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={openSubCategoryModal}
        onClose={handleCloseSubCategory}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={openSubCategoryModal}>
          <div className={classes.paper} style={{ maxWidth: "80vw", minWidth: "400px", display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" >
              Add Sub Category of {subCategory.parentCatName}
            </Typography>

            <TextField variant="outlined" placeholder="Sub category name" value={subCategory.title} onChange={(e) => setSubCategory({ ...subCategory, title: e.target.value })} style={{ marginTop: 3 }} />

            <Box style={{ display: 'flex', flexDirection: 'row', marginTop: "24px" }}>
              <Button variant="outlined" onClick={handleCloseSubCategory} style={{ marginRight: '18px' }}>
                Cancel
              </Button>
              <CustomButton label="Add" loading={loading} variant="contained" onClick={handleAddSubCat} />
            </Box>

          </div>
        </Fade>
      </Modal>
      {/* Category Modal */}
      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={addCategoryModal}
        onClose={closeAddCategory}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={addCategoryModal}>
          <div className={classes.paper}>
            <AddCategory
              onClose={closeAddCategory}
              edit={edit}
              category={editableCategory}
              handleUpdate={handleUpdateCategory}
              getCategoryList={getCategoryList}
            />
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

Category.defaultProps = {};

Category.propTypes = {};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, null)(Category);
