<!doctype html>
<html lang="fr" ng-app="bobbyApp">
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(.) styles/vendor.css -->

    <!-- endbuild -->
    <link rel="stylesheet" href="assets/css/main.css">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">


  </head>
  <body ng-app="bobbyApp" style="background-color:#414361;">
    <div ng-view></div>


<!-- fin fonction barre de naviagation -->





    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
     <script>
       !function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){
       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),
       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)
       }(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');
    </script>

    <script src="app/vendor/angular/angular.min.js"></script>
    <script src="app/vendor/jquery/jquery.js"></script>
    <script src="app/vendor/bootstrap/bootstrap.js"></script>
    <script src="app/vendor/toArrayFilter/toArrayFilter.js"></script>

        <!-- build:js({.tmp,app}) scripts/scripts.js -->
        <!--<script src="scripts/app.js"></script>
        <script src="scripts/controllers/main.js"></script>
        <script src="scripts/controllers/index.js"></script>
        <script src="scripts/controllers/my_items.js"></script>
        <script src="scripts/controllers/categorie.js"></script>
        <script src="scripts/controllers/validated_booking.js"></script>
        <script src="scripts/controllers/waiting_booking.js"></script>
        <script src="scripts/controllers/refused_booking.js"></script>
        <script src="scripts/controllers/my_validated_booking.js"></script>
        <script src="scripts/controllers/my_waiting_booking.js"></script>
        <script src="scripts/controllers/my_refused_booking.js"></script>

        <script src="scripts/controllers/add_item.js"></script>
        <script src="scripts/services/serviceAjax.js"></script>
        <!-- endbuild -->


        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

    <!-- App -->
    <script src="app/env.js"></script>
    <script src="app/app.js"></script>
    <script src="app/factories.js"></script>
    <script src="app/directives.js"></script>
    <script src="app/components.js"></script>
</body>
</html>
