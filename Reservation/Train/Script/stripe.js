var stripe = Stripe('pk_test_51NfIDoSEOmD9y5R3dryyKAKnY246TmNH04r62Mjmym251Or7y8vQEuKHRBfGggdSwGME61vFFLjb3wlqoitFCykd00ASV8nGTf');

  var checkoutButton = document.getElementById('checkout-button');
  checkoutButton.addEventListener('click', function () {
    // When the customer clicks on the button, redirect
    // them to Checkout.
    stripe.redirectToCheckout({
      lineItems: [{price: 'price_1PVlZWSEOmD9y5R33jSgbcsJ', quantity: 1}],
      mode:"subscription",
      // Note that it is not guaranteed your customers will be redirected to this
      // URL *100%* of the time, it's possible that they could e.g. close the
      // tab between form submission and the redirect.
      successUrl: 'https://formhero.com/',
      cancelUrl: 'https://formhero.com/',
    })
    .then(function (result) {
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        var displayError = document.getElementById('error-message');
        displayError.textContent = result.error.message;
      }
    });
  });