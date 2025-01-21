import React from "react";

const AboutPage = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">About This App</h1>
      <p>
        Welcome to the application overview! This page provides a detailed
        description of the technologies, libraries, and functionalities used
        in building this app.
      </p>

      <h2>Technology Stack</h2>
      <ul>
        <li><strong>Frontend Library:</strong> ReactJS 18.3.1</li>
        <li><strong>CSS Framework:</strong> Bootstrap 5</li>
        <li><strong>Form Handling:</strong> Formik</li>
        <li><strong>State Management:</strong> Context API with <code>useReducer</code></li>
        <li><strong>Backend: </strong>NodeJS and libraries like: 
            <ul>
                <li>Express</li>
                <li>Body-parser</li>
                <li>CORS</li>
                <li>DotEnv (.env)</li>
            </ul>
        </li>
        <li><strong>Database:</strong> Local storage used to save:
            <ul>
            <li>Favorite items</li>
            <li>Cart items</li>
            <li>Orders</li>
            <li>Delivery addresses</li>
            </ul>
        </li>
       
        <li><strong>Product & Category Data:</strong> Fetched from <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer">DummyJSON API</a></li>
        <li><strong>Payment Gateway:</strong> Stripe Integration via Node.js API</li>
      </ul>

      <h2>Functionalities</h2>
      <ul>
        <li>Dynamic page title for each page.</li>
        <li>Product listing page with column layout (sidebar and grid view)</li>
        <li>Quick Product view on product listing page</li>
        <li>Dynamic breadcrumb generation</li>
        <li>Cart and wishlist management with persistent local storage</li>
        <li>Dynamic price formatting function like thousand separator and currency symbol.</li>
        <li>Responsive design with a focus on mobile-friendly layouts</li>
        <li>Off-canvas navigation menu for mobile devices</li>
        <li>Header with a search bar and profile, cart, and wishlist icons</li>        
        <li>Scroll-to-top functionality</li>
        <li>Multiple product images display on product details page and can change on clicking thumbnail</li>
        <li>Main product enlarge.</li>
        <li>Discount management with coupon codes</li>
        <li>Shipping option for the order on checkout page.</li>
      </ul>

      <h2>Notable Features</h2>
      <ul>
        <li>Optimized product grid layout for uniform card heights</li>
        <li>Off-canvas for slide cart.</li>
        <li>Reusable component for Ratings</li>
        <li>Reusable utility functions such as price formatting</li>
        <li>Product Quick View on product listing page.</li>
        <li>Browsing history at the bottom side for the certain pages</li>
      </ul>

      <h2>React Hooks/Functions used</h2>
      <ul>
        <li>useEffect</li>
        <li>useContext</li>
        <li>useReducer</li>
        <li>useState</li>
        <li>useNavigate</li>
        <li>useLocation</li>
        <li>useParams</li>
        <li>useRef</li>
      </ul>

      <h2>Stripe Payment Gateway Integration</h2>
      <p>
        The app integrates Stripe for secure and seamless payment processing. 
        Key features of the Stripe implementation include:
      </p>
      <ul>
        <li><strong>Line Items:</strong> Each item in the cart is dynamically added to the payment session with details like price, quantity, and description.</li>
        <li><strong>Custom Coupons:</strong> Coupons are validated and applied to the cart, reducing the total amount before checkout.</li>
        <li><strong>Custom Delivery options:</strong> Users can select the option of shipping, which is included in the payment session and displayed on Stripe's hosted checkout page.</li>
        <li><strong>API Integration:</strong> A custom Node.js backend handles Stripe's API requests for creating payment sessions and webhook listeners for payment status updates.</li>
        <li><strong>Secure Payments:</strong> All transactions are managed with Stripe's secure, PCI-compliant infrastructure.</li>
      </ul>

      <h2>Future Enhancements</h2>
      <ul>        
        <li>Integration with a real database MongoDB</li>
        <li>User registration module with custom form or Open ID (i.e. Google, Facebook)</li>
        <li>Form validation with Yup.</li>
        <li>Improved SEO for dynamic routes</li>
        <li>More advanced state management with Redux Toolkit</li>
      </ul>

      <p className="mt-5 text-center fs-5">
        Thank you for exploring this application! If you have any questions or feedback, feel free to reach out.
      </p>
    </div>
  );
};

export default AboutPage;
