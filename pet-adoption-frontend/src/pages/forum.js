import { useEffect, useState } from "react";
import { request } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Typography, Card, CardContent, Button, TextField, Grid, Box, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: "", content: "" });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Fetch blogs
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        request("GET", "/blogPosts")
            .then((response) => {
                setBlogs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
                showSnackbar("Failed to load blogs.", "error");
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewBlog({ ...newBlog, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!newBlog.title || !newBlog.content) {
            showSnackbar("Title and content cannot be empty.", "error");
            return;
        }

        request("POST", "/blogPost", newBlog)
            .then(() => {
                showSnackbar("Blog posted successfully!", "success");
                setNewBlog({ title: "", content: "" });
                fetchBlogs();
            })
            .catch((error) => {
                console.error("Error posting blog:", error);
                showSnackbar("Failed to post blog.", "error");
            });
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Forum
                </Typography>

                {/* Blog form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: "20px" }}>
                    <TextField
                        label="Title"
                        name="title"
                        value={newBlog.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={newBlog.content}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Post
                    </Button>
                </Box>

                {/* Blog list */}
                <Grid container spacing={2}>
                    {blogs.map((blog) => (
                        <Grid item xs={12} md={6} key={blog.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {blog.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Snackbar notification */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
}