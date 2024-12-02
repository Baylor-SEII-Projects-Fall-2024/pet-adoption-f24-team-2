package petadoption.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import petadoption.api.blog.Blog;
import petadoption.api.blog.BlogService;;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${FRONTEND_URL}")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping("/blogPosts")
    public List<Blog> getBlogs() {

        return blogService.getAllBlogs();
    }

    @GetMapping("/blogPost/{id}")
    public Blog getBlog(@PathVariable Long id) {

        return blogService.getBlogById(id);
    }

    @PostMapping("/blogPost")
    public Blog createBlog(@RequestBody Blog blog) {

        return blogService.createBlog(blog);
    }

    @PutMapping("/blogPost")
    public Blog updateBlog(@RequestBody Blog blog) {

        return blogService.updateBlog(blog);
    }

    @DeleteMapping("/blogPost/{id}")
    public void deleteBlog(@PathVariable Long id) {

        blogService.deleteBlog(id);
    }
}
