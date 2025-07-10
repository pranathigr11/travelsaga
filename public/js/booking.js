// public/js/booking.js
/* eslint-disable */

const bookTour = async (tourId, price) => {
  try {
    // 1) Send a request to the API to create the booking
    const res = await fetch(`/api/v1/bookings/${tourId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ price })
    });

    const data = await res.json();

    if (data.status === 'success') {
      showAlert('success', 'Tour booked successfully!');
      window.setTimeout(() => {
        location.assign('/my-bookings'); // Redirect to the new "My Bookings" page
      }, 1500);
    } else {
      showAlert('error', data.message);
    }

  } catch (err) {
    showAlert('error', 'Something went wrong! Please try again.');
  }
};

const bookBtn = document.getElementById('book-tour');

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    const price = e.target.dataset.tourPrice;
    bookTour(tourId, price);
  });
}