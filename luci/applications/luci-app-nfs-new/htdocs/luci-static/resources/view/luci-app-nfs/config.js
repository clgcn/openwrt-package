'use strict';
'require form';
'require poll';
'require rpc';
'require uci';
'require view';

// Function to check if a file exists
function fileExists(path) {
  return fs.access(path, fs.F_OK);
}

// Function to reload NFS services after configuration changes
function reloadNFS() {
  return shell.run('/etc/init.d/nfs reload');
}

return view.extend({
  load: function() {
    return Promise.all([
      uci.load('nfs'),
    ]);
  },

  render: function(data) {
    var m, s, o;

    // Check if /etc/config/nfs exists
    if (!fileExists('/etc/config/nfs')) {
      return E('div', {}, _('NFS configuration not found.'));
    }

    m = new form.Map('nfs', _('NFS Manage'));

    // -- NFS Share --
    s = m.section(form.TypedSection, "share", translate("Shared Directories"));
    s.anonymous = true;
    s.addremove = true;
    s.template = "cbi/tblsection";

    o = s.option(form.Flag, "enabled", translate("Enable"));
    o.rmempty = false;
    o.default = "1";

    o = s.option(form.Value, "path", translate("Path"));
    o.placeholder = "/mnt";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "clients", translate("Clients"));
    o.placeholder = "192.168.1.0/24";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "options", translate("options"));
    o.placeholder = "rw,sync,root_squash,all_squash,insecure,no_subtree_check";
    o.rmempty = false;
    o.optional = false;

    // -- NFS Mount --
    c = m.section(form.TypedSection, "mount", translate("Mounted Points"));
    c.anonymous = true;
    c.addremove = true;
    c.template = "cbi/tblsection";

    o = c.option(form.Flag, "enabled", translate("Enable"));
    o.default = "1";
    o.rmempty = false;

    o = c.option(form.Value, "source", translate("source"));
    o.placeholder = "192.168.1.1:/mnt/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "target", translate("target"));
    o.placeholder = "/mnt/nfs/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "options", translate("options"));
    o.placeholder = "rw,nolock";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "delay", translate("delay"));
    o.placeholder = "5";
    o.rmempty = false;
    o.optional = false;

    // Set title references for path and target options if /etc/config/fstab exists
    if (fileExists('/etc/config/fstab')) {
      o.get('path').titleref = luci.dispatcher.build_url("admin", "system", "fstab");
      o.get('target').titleref = luci.dispatcher.build_url("admin", "system", "fstab");
    }

    var apply = form.value('cbi.apply');
    if (apply) {
      return reloadNFS().then(function() {
        return m.render();
      });
    }

    return m.render();
  },
});