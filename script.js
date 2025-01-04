var tab_nav = $("#navScrollDiv"); // tab nav
var tab_content = $(".tab-content"); // tab content

// Dynamic classes
tab_content.each(function (i) {
  $(this).attr("id", "tab-" + i);
});
tab_nav.children("div").each(function (i) {
  $(this).attr("data-target", "#tab-" + i);
});

$(".mobile-channel")
  .children("div")
  .each(function (i) {
    $(this).attr("data-target", "#tab-" + i);
  });

// Show first tab
tab_content.hide();

const search = new URLSearchParams(window.location.search);
if (search.get("tab")) {
  if (search.get("tab") === "tab-4") {
    $(`[data-channel="channel-0"]`).show();
  }
  const searchQuery = `#${search.get("tab")}`;
  tab_nav.children(`[data-target="${searchQuery}"]`).addClass("active");
  tab_nav.children(`[data-target="${searchQuery}"]`).addClass("bg-white");
  $(searchQuery).show();
} else {
  tab_nav.children("div").first().addClass("active");
  tab_nav.children("div").first().addClass("bg-white");
  tab_content.first().show();
}

$(".stream-1").show();
$(".stream-2").hide();

let openedTab;

function openTabs() {
  if (!$("input[name=multistream]")[0].checked) {
    var activeTab = $(this).attr("data-target");
    $(`[data-target="${activeTab}"]`).siblings().removeClass("active");
    $(`[data-target="${activeTab}"]`).siblings().removeClass("bg-white");
    $(`[data-target="${activeTab}"]`).addClass("active");
    $(`[data-target="${activeTab}"]`).addClass("bg-white");

    window.history.pushState("", null, `?tab=${activeTab.slice(1)}`);
    if (!window.location.href.includes("index")) {
      window.location.pathname = "/src/index.html";
    }

    $(activeTab).siblings().hide().removeClass("active");
    $(activeTab).fadeIn().addClass("active");

    $(".mobile-nav").fadeOut();
  } else {
    $(".warning-multistream").fadeIn();
    $("body").addClass("overlay-shown");
    openedTab = $(this);
  }
}

$(".notification-content").on("click", function () {
  $("body").addClass("overlay-shown");
  $(".notification-modal").fadeToggle();
});

$(".notification-close").on("click", function () {
  $(".notification-modal").fadeOut();
  $("body").removeClass("overlay-shown");
});

const progress = $(".notification-progress");
const noficationProgressTimer = 10;

function startNotificationProgress() {
  progress[0].style.setProperty("--progress-value", 100);
  progress.attr("data-progress", noficationProgressTimer);

  setTimeout(decrementNotificationProgress, 1000);
}

function decrementNotificationProgress() {
  let progressVaue = +progress.attr("data-progress");
  let interval = null;
  let intervalTime = progressVaue;
  if ($(".notification-modal").is(":visible") && progressVaue > 1) {
    progress.attr("data-progress", --progressVaue);
    interval = setInterval(function() {
      intervalTime -= 0.1;
      progress[0].style.setProperty("--progress-value", intervalTime * 100 / noficationProgressTimer);

    }, 100)
    setTimeout(() => {
      decrementNotificationProgress()
      clearInterval(interval);
    }, 1000);
  } else {
    $(".notification-modal").fadeOut();
    $("body").removeClass("overlay-shown");
  }
}

$(".warning-no,.warning-close").on("click", function () {
  $(".warning-multistream").fadeOut();
  $("body").removeClass("overlay-shown");
});

$(".warning-yes").on("click", function () {
  $("input[name=multistream]").trigger("click");
  $(".warning-multistream").fadeOut();
  $("body").removeClass("overlay-shown");
  openedTab.trigger("click");
});

tab_nav.children("div").each(function () {
  $(this).on("click", openTabs);
});

$(".mobile-channel")
  .children("div")
  .each(function () {
    $(this).on("click", openTabs);
  });

tab_nav.children("div").each(function () {
  $(this).on("click", openTabs);
});

$(".overlay-stream").hide();

tab_content.find(".channel").on("click", function () {
  tab_content.find(".channel-2").removeClass("bg-white");
  tab_content.find(".channel-2").addClass("bg-whiteTransparent");
  tab_content.find(".channel-2").addClass("opacity-[.6]");
  tab_content.find(".channel-2").removeClass("selectedChannel");
  tab_content.find(".channel-2").find(".watch-btn span").text("Watch");

  tab_content.find(".channel").removeClass("bg-white");
  tab_content.find(".channel").addClass("bg-whiteTransparent");
  tab_content.find(".channel").removeClass("selectedChannel");
  tab_content.find(".channel").find(".watch-btn span").text("Watch");

  $(this).addClass("bg-white");
  $(this).addClass("selectedChannel");
  $(this).find(".watch-btn span").text("Watching");

  $(".channel-header").show();
  $(".stream-1").show();
  $(".stream-2").hide();

  if ($(window).width() < 920) {
    $(".overlay-stream").fadeIn();
  }

  const title = $(this).attr("title");
  const image = $(this).find("img").attr("src");

  let found = false;

  $(".channel-header").each(function (i) {
    $(".chan-tab").each(function () {
      if ($(this).text() === title) {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        found = true;
      }
    });
  });

  $(".channel-header").each(function (e, i) {
    if (!found) {
      const newTab = $(this).find(".chan-tab:first-child").clone();
      newTab.appendTo($(this));
      newTab.text(title);
      newTab.prev().children("img").attr("src", image);
      newTab.siblings().removeClass("active");
      newTab.addClass("active");
    }
  });

  $(".chan-tab").on("click", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");

    const channel = $(this).text();

    tab_content.find(".channel").removeClass("bg-white");
    tab_content.find(".channel").removeClass("selectedChannel");
    tab_content.find(".channel").addClass("bg-whiteTransparent");
    $(".channel").each(function () {
      if ($(this).attr("title") === channel) {
        $(this).addClass("bg-white");
        $(this).addClass("selectedChannel");
      }
    });
  });
});

tab_content.find(".channel-2").each(function (i) {
  $(this).attr("data-channel-stream", "channel-" + i);
});

$(".stream-2").each(function () {
  $(this)
    .children("div:not(.stream-footer)")
    .each(function (i) {
      $(this).attr("data-channel", "channel-" + i);
    });
});

$(".stream-2").children("div:not(.stream-footer)").hide();
$(".stream-2").children("div").first().show();

tab_content.find(".channel-2").on("click", function () {
  tab_content.find(".channel-2").removeClass("bg-whiteLighter");
  tab_content.find(".channel-2").addClass("bg-whiteTransparent");
  tab_content.find(".channel-2").addClass("opacity-[.6]");
  tab_content.find(".channel-2").find(".watch-btn span").text("Watch");

  tab_content.find(".channel").removeClass("bg-white");
  tab_content.find(".channel").addClass("bg-whiteTransparent");
  tab_content.find(".channel").find(".watch-btn span").text("Watch");

  $(".stream-1").hide();
  $(".stream-2").show();

  $(this).find(".watch-btn span").text("Watching");
  $(this).removeClass("bg-whiteTransparents");
  $(this).addClass("bg-whiteLighter");
  $(this).removeClass("opacity-[.6]");

  var activeTab = $(this).attr("data-channel-stream");

  $(`[data-channel="${activeTab}"]`).siblings().hide().removeClass("active");
  $(`[data-channel="${activeTab}"]`).show().addClass("active");

  if ($(window).width() < 920) {
    $(".overlay-stream").fadeIn();
  }
});

$(".overlay-close").on("click", function () {
  $(".overlay-stream").fadeOut();
});

$(".time-toggler").on("click", function () {
  $(this).find("ul").slideToggle();
});

$(".nav-toggler").on("click", function () {
  $(".mobile-nav").toggle();
});

$(".faq-accordion").children("span:last-child").hide();
$(".faq-accordion:first-child").children("span:last-child").hide();

$(".faq-accordion").on("click", function () {
  $(this).siblings().addClass("bg-whiteTransparent");
  $(this).siblings().removeClass("bg-whiteLighter");
  $(this).addClass("bg-whiteLighter");
  $(this).removeClass("bg-whiteTransparent");

  $(this).siblings().children("span:first-child").addClass("text-white");
  $(this).siblings().children("span:first-child").removeClass("text-violet");
  $(this).siblings().children("span:last-child").slideUp();

  $(this).children("span").first().removeClass("text-white");
  $(this).children("span").first().addClass("text-violet");
  $(this).children("span").last().slideDown();
});

$(".channel-prev").hide();

$(".channel-next").on("click", function () {
  const tabWidth = tab_nav.width();
  tab_nav.animate({ scrollLeft: tab_nav.get(0).scrollWidth - tabWidth }, 800);
  $(this).fadeOut();
  $(".channel-prev").fadeIn();
});

$(".channel-prev").on("click", function () {
  tab_nav.animate({ scrollLeft: 0 }, 800);
  $(this).fadeOut();
  $(".channel-next").fadeIn();
});

// Hide Why AjjaTV modal by default
$(".why-zuzz-modal").hide();

// Show modal only when clicking the menu item
$(".open-why-zuzz").on("click", function () {
  $(".why-zuzz-modal").fadeIn();
  $("body").addClass("overlay-shown");
});

// Close modal when clicking close button
$(".close-why-zuzz").on("click", function () {
  $(".why-zuzz-modal").fadeOut();
  $("body").removeClass("overlay-shown");
});

// Close modal when clicking outside
$(document).on("click", function(event) {
  if ($(event.target).closest(".why-zuzz-modal .relative").length === 0 && 
      !$(event.target).closest(".open-why-zuzz").length) {
    $(".why-zuzz-modal").fadeOut();
    $("body").removeClass("overlay-shown");
  }
});

$(".report-page").on("click", function () {
  $(".report-box").fadeToggle();
});

$(".report-btn").on("click", function () {
  $(".report-box").fadeOut();
});

$(".report-close").on("click", function () {
  $(".report-box").fadeOut();
});

$(".page-refresh").on("click", function () {
  location.reload();
});

$(".share-btn").on("click", function (e) {
  e.preventDefault();
  $(this).next(".share-dropdown").fadeToggle();
});

$(".notification-clear").on("click", function (e) {
  e.preventDefault();

  if (!$(".notification-dropdown").find("p").length) {
    $(".notification-dropdown").find("ul").empty();
    $(".notification-dropdown").append(
      "<p class='py-2 px-2'>You are upto date</p>"
    );
    $(".nottification-badge").fadeOut();
    $(".notification-animate").removeClass("notification-animate");
  }
});

// Close notification dropdown when clicking outside
$(document).on('click', function(event) {
  if (!$(event.target).closest('.notification').length) {
    $('.notification-dropdown').fadeOut();
  }
});

// Prevent event bubbling for notification click
$(".notification").children("a").on("click", function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).next(".notification-dropdown").fadeToggle();
});

$("input[name=multistream]").on("change", function () {
  if ($(this)[0].checked) {
    // Multistream ON
    $(".multi-player").addClass("grid");
    $(".multi-player").removeClass("hidden");
    $(".single-player").addClass("hidden");
    $(".chan-tab").each(function () {
      if (!$(this).is(":nth-child(1)")) {
        $(this).remove();
      } else {
        $(this).addClass("active");
        $(this).addClass("hidden");
      }
    });
    $(".channel-header").append(
      `<p class="max-four text-white font-rubikSemibold text-lg">Select Maximum 4 screens</p>`
    );

    $(".main-sidebar").find(".tab-content").hide();
    $(".main-sidebar").find(".multi-sidebar").fadeIn();
    $("#navScrollDiv").children().removeClass("bg-white");
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
  } else {
    // Multistream OFF
    $(".multi-player").removeClass("grid");
    $(".multi-player").addClass("hidden");
    $(".single-player").removeClass("hidden");
    $(".max-four").remove();
    $(".chan-tab:nth-child(1").removeClass("hidden");
    $(".main-sidebar").find(".multi-sidebar").hide();
    $(".main-sidebar").find(".multi-sidebar + .tab-content").fadeIn();
    $("#navScrollDiv").children().first().addClass("bg-white");
    window.history.pushState("", null, `?tab=tab-0`);
  }
});

$(".multi-sidebar-header a").on("click", function (e) {
  e.preventDefault();
  $(".multi-sidebar-header a").removeClass("font-rubikBold text-violet");
  $(".multi-sidebar-header a").addClass("font-rubikMedium text-white");
  $(this).removeClass("font-rubikMedium text-white");
  $(this).addClass("font-rubikBold text-violet");

  const tabname = $(this).attr("data-tab");
  $(".multi-channel").hide();
  $(`[data-cont="${tabname}"]`).fadeIn();
});

$(".multi-channel a").on("click", function (e) {
  e.preventDefault();

  if ($(".multi-channel a.selected").length < 4) {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      $(".multi-player .mini-player:nth-child(1)").remove();
    } else {
      $(this).addClass("selected");
      $(".multi-player").append(`<div class="mini-player bg-whiteTransparent rounded-[4px] paused"></div>`);
    }
  } else {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      $(".multi-player .mini-player:nth-child(1)").remove();
    }
    $(this).removeClass("selected");
  }
});