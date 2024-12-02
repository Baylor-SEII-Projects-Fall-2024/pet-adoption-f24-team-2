package petadoption.api.blog;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = Blog.TABLE_NAME)
public class Blog {
    public static final String TABLE_NAME = "BLOGS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(name = TABLE_NAME + "_GENERATOR", sequenceName = TABLE_NAME + "_SEQUENCE")
    @Column(name = "BLOG_ID")
    Long id;

    @Column(name = "TITLE", nullable = false)
    String title;

    @Column(name = "CONTENT", columnDefinition = "TEXT", nullable = false)
    String content;

    @Column(name = "CREATED_AT", nullable = false)
    LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UPDATED_AT")
    LocalDateTime updatedAt;

    @Column(name = "TAGS")
    String tags;

    @Column(name = "THUMBNAIL_URL")
    String thumbnailUrl;

    public void updateContent(String newContent) {
        this.content = newContent;
        this.updatedAt = LocalDateTime.now();
    }
}