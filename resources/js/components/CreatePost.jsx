import React, { useState } from 'react';
import { router} from '@inertiajs/react';

function CreatePost() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        router.post('/post', formData, {
            onFinish: () => {
                setContent('');
                setImage(null);
            }
        });
    };

    return (
        <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='card shadow-lg'>
                            <div className='card-header bg-primary text-white'>
                                <h5 className='mb-0'>Create a Post</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            id="content"
                                            rows="5"
                                            placeholder="Enter content here..."
                                            value={content}
                                            onChange={handleContentChange}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-25">Share Now!</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
       </div>

    );
}

export default CreatePost;
