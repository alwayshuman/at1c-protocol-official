<style>
.us_menu.horizontal.dark {
  background: #2d3748 !important;
  border-bottom: 2px solid #38bdf8 !important;
}
.us_menu.horizontal.dark a {
  color: #e2e8f0 !important;
}
.us_menu.horizontal.dark a:hover {
  color: #38bdf8 !important;
}
.at1c-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 0 1rem;
}
.at1c-logo-box {
  width: 28px;
  height: 28px;
  background: #1a202c;
  border: 2px solid #38bdf8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}
.at1c-logo-box::after {
  content: '';
  position: absolute;
  top: -3px;
  right: -3px;
  width: 7px;
  height: 7px;
  background: #38bdf8;
  border-radius: 1px;
}
.at1c-logo-box span {
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.at1c-brand-name {
  color: #e2e8f0 !important;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
}
.nav-item { padding-left: 2rem; }
.btn-block { width: 85%; }
</style>

<ul class='us_menu horizontal dark' style='z-index:50;' id='us_menu_1_638b71f2ed026'>
  <div class='us_brand full_screen'>
    <a href="<?=$us_url_root?>" class="at1c-brand">
      <div class="at1c-logo-box"><span>AT1C</span></div>
      <span class="at1c-brand-name">AT1C Protocol</span>
    </a>
  </div>
  <div class='flex-grow-1'></div>
  <div class='us_menu_mobile_wrapper'>
    <div class='us_brand'>
      <a href="<?=$us_url_root?>" class="at1c-brand">
        <div class="at1c-logo-box"><span>AT1C</span></div>
        <span class="at1c-brand-name">AT1C Protocol</span>
      </a>
    </div>
    <div class='us_menu_mobile_control' data-target='1_638b71f2ed026'>
      <i class='fa fa-bars'></i>
    </div>
  </div>

  <?php if(isset($user) && $user->isLoggedIn()) { ?>
    <li class=''>
      <a class='' href='<?=$us_url_root?>users/register-agent.php'>
        <i class='fa fa-plus-circle'></i>
        <span class='labelText'>Register Agent</span>
      </a>
    </li>
    <li class=''>
      <a class='' href='<?=$us_url_root?>at1c-dashboard.php'>
        <i class='fa fa-list'></i>
        <span class='labelText'>My Agents</span>
      </a>
    </li>
    <li class='dropdown'>
      <a class='sub-toggle' href='<?=$us_url_root?>' id='menu_1_638b71f2ed026_dropdown_1' role='button' aria-haspopup='true' aria-expanded='false' data-toggle='dropdown' data-target='#menu_1_638b71f2ed026_dropdown_1'>
        <i class='fa fa-user'></i>
        <span class='labelText'><?=$user->data()->fname?></span>
        <span class='caret'></span>
      </a>
      <ul class='us_sub-menu' aria-labelledby='menu_1_dropdown_1' style='z-index:50;'>
        <li class=''>
          <a class='' href='<?=$us_url_root?>users/account.php'>
            <i class='fa fa-user'></i>
            <span class='labelText'>Account</span>
          </a>
        </li>
        <?php if(checkGroup(1)) { ?>
        <div class='dropdown-divider'></div>
        <li class=''>
          <a class='' href='<?=$us_url_root?>users/admin.php'>
            <i class='fa fa-cogs'></i>
            <span class='labelText'>Admin Dashboard</span>
          </a>
        </li>
        <?php } ?>
        <div class='dropdown-divider'></div>
        <li class=''>
          <a class='' href='<?=$us_url_root?>users/logout.php'>
            <i class='fa fa-sign-out'></i>
            <span class='labelText'>Logout</span>
          </a>
        </li>
      </ul>
    </li>
  <?php }else{ ?>
    <li class=''>
      <a class='' href='<?=$us_url_root?>users/login.php'>
        <i class='fa fa-sign-in'></i>
        <span class='labelText'>Login</sp