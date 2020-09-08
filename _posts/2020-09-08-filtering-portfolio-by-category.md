---
layout: post
title:  "Filtering by category on a Jekyll site"
author: Sophie Edgar-Andrews
featured-image: filtering-buttons.png
featured-image-alt: Filtering buttons
---

**Creating content filter buttons in a Jekyll blog is way harder than it feels like it should be...** 

My portfolio consists of a mixture of code I have written and academic publications. As these are pretty distinct items, I wanted to add a way for users of my website to filter by these categories at the push of a button.

Having come from a largely back-end background, I felt this should be relatively straightforward. It'll just take a few minutes to code!

**Oh how wrong I was.**

Jekyll is a static site generator, and as such, the content is effectively preloaded when the page is rendered. There is no downstream processing. Urgh. For someone who quite likes MVC design, this makes me feel kinda dirty.

After a good few hours of tinkering around, I managed to get it working. To hopefully save somebody else time fighting the same battle in future, I'm going to share what I did and why. I will show you a stripped-down version of my code, and break down what it's doing.

**First, let's create some buttons**

~~~ html
<div class="button-group filter-button-group justify-content-center">
    <a class="btn btn-sm btn-primary" data-filter=".publication">Publications</a>
    <a class="btn btn-sm btn-primary" data-filter=".code">Code</a>
    <a class="btn btn-sm btn-primary active" data-filter="*">All</a>
</div>
~~~

Here I am creating a button group consisting of three buttons: one for each of my categories, and a final catch-all button to display the complete, unfiltered data. As I only (currently) have two categories, I hardcoded these. This won't be optimal if more categories are included in future.

**Next, let's create our portfolio grid**

{% raw %}
~~~ html
<div class="grid">
  {% for project in site.portfolio %}
     <div class="col-md-4 col-sm-6 portfolio-item {{ project.categories }}">
        <a class="portfolio-link" data-toggle="modal" href="#p{{ forloop.index }}">
          <img class="img-fluid" src="{{ project.caption.thumbnail }}" alt="">
        </a>
     </div>
  {% endfor %}
</div>
 ~~~
 {% endraw %}
 
Here, I am creating a grid and using Liquid to dynamically populate it with the contents of my portfolio. The portfolio items are each saved as markdown (.md) files in the _portfolio folder. Each .md file contains the following information in its front matter which is used to populate the grid:

{% raw %}
~~~ markdown
---
categories: publication

caption:
  thumbnail: assets/img/portfolio/image-thumbnail.jpg
---
body
~~~
{% endraw %}

Note that if you want to include titles, subtitles, captions, whatever, then these can be included too. This is just a minimal working example. The most important thing to note here is the categories.

**Now, let's get that filter filterin'!**

{% raw %}
~~~ javascript
<script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
<script src="https://unpkg.com/isotope-layout@3.0/dist/isotope.pkgd.js"></script>
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>

<script>
  var $grid = $('.grid').imagesLoaded( function() {
      $grid.isotope({});
  });
  $('.filter-button-group').on( 'click', 'a', function() {
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
   });
   $('.button-group a.btn').on('click', function(){
      $('.button-group a.btn').removeClass('active');
      $(this).addClass('active');
   });
</script>
~~~
{% endraw %}

Here, we pull in the required external scripts and then use <a href="https://isotope.metafizzy.co/" target="_blank">Isotope</a> to perform the filtering. First, we need to initiate Isotope, and if you are using images in your grid, I strongly recommend you use **.imagesLoaded**. If you don't, it's likely you will encounter issues when the page renders where the grid items overlap and form a horrible mess.

![Yuck](/assets/img/posts/20200908-yuck.png){:class="img-responsive"}

Ew!

Then, we specify that on clicking a button in our button group, we should filter by the data-filter value, and set the active button.

Isotope has some really helpful documentation, and if you run into issues, I wholly recommend you check out their <a href="https://isotope.metafizzy.co/faq.html" target="_blank">FAQ</a> as you can be 99% sure that whatever issue you're having, they've addressed it before.

Functionally, that's it! That should be all you need to filter by category in Jekyll. The concepts here can be applied to any filtering. Here, I have used it for portfolio items, but the same process could be applied to filtering blog posts, images, etc.

You can also use CSS to beautify your buttons and grid to make them look and feel consistent with the rest of your site. This post has really focused on the functional set up, so I won't delve into the aesthetics too much here.

**What are the stumbling blocks??**

I encountered two major issues when building this into my site. The first issue was with grid items overlapping as I touched upon above. The reason this happens is that when the page is first rendered, unloaded images throw off the isotope layouts causing elements within them to overlap. .imagesLoaded (as the name strongly suggests...) detects when the images have been loaded and helps overcome this problem.

The other major issue I encountered only became apparent when I tried to redeploy this code on GitHub pages. While developing this code, I was initially loading the Javascript scripts over HTTP, rather than HTTPS. This worked fine locally, however GitHub Pages hosts the file over a secure connection, and as such, the browser is therefore unable to load a script over HTTP if the page is hosted on HTTPS.

Changing the...

~~~javascript
<script src="http://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
~~~

script calls to...

~~~javascript
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
~~~

... resolved the issue, but bloody hell! It took so long to identify the issue. Urgh.

**So that's all there is to it!**

All in all, it's not a huge amount of code. Adding the option to filter your content by categories affords so much flexibility to users of your site, so in my opinion, it's worth the initial hassle of setting it up. Keep in mind the potential stumbling blocks, and I'm sure you'll be fine! 

Hope this brief overview has been helpful.

Over and out.