import React from 'react';

interface Review {
    id: string;
    user_id: string;
    clinic_id: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <p>No reviews available.</p>;
    }

    return (
        <div>
            <h3>Reviews</h3>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                        <p>Rating: {review.rating} / 5</p>
                        <p>Comment: {review.comment || 'No comment'}</p>
                        <p>
                            <small>Reviewed on: {new Date(review.created_at).toLocaleDateString()}</small>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewList;
