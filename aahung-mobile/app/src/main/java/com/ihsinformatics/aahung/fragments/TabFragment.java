package com.ihsinformatics.aahung.fragments;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentPagerAdapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ihsinformatics.aahung.App;
import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.GlobalConstants;
import com.ihsinformatics.aahung.common.TabAdapter;
import com.ihsinformatics.aahung.databinding.FragmentTabBinding;
import com.ihsinformatics.aahung.db.dao.UserDao;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.model.metadata.Role;
import com.ihsinformatics.aahung.views.DataProvider;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import static com.ihsinformatics.aahung.common.Keys.ROLE_ADMIN;
import static com.ihsinformatics.aahung.common.Keys.ROLE_IMPLEMENTER;


public class TabFragment extends Fragment {


    private FragmentTabBinding binding;
    private TabAdapter adapter;
    private ArrayList<FormDetails> lseForms = new ArrayList<>();
    private ArrayList<FormDetails> shrmForms = new ArrayList<>();
    private ArrayList<FormDetails> commsForms = new ArrayList<>();

    @Inject
    UserDao userDao;

    public TabFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_tab, container, false);
        initList();
        return binding.getRoot();
    }

    @Override
    public void onStart() {
        super.onStart();
        ((App) getActivity().getApplicationContext()).getComponent().inject(this);


        if (lseForms.isEmpty() && shrmForms.isEmpty() && commsForms.isEmpty()) {

            boolean isAdmin = false;

            if (userDao.getRole(GlobalConstants.USER.getUserId(), ROLE_ADMIN) != null || userDao.getRole(GlobalConstants.USER.getUserId(), ROLE_IMPLEMENTER) != null)
                isAdmin = true;

            for (DataProvider.Forms forms : DataProvider.Forms.values()) {
                FormDetails formDetails = new FormDetails(forms);

                switch (forms.getFormSection()) {
                    case LSE:
                        if (isAdmin || hasAccess("LSE Monitor", "LSE Manager", "LSE Data Entry Operator"))
                            formDetails.enableAccess();
                        lseForms.add(formDetails);
                        break;
                    case SRHM:
                        if (isAdmin || hasAccess("SRHM Monitor", "SRHM Manager", "SRHM Data Entry Operator"))
                            formDetails.enableAccess();
                        shrmForms.add(formDetails);
                        break;
                    case COMMS:
                        if (isAdmin || hasAccess("Communications Monitor", "Communications Manager", "Communications Data Entry Operator"))
                            formDetails.enableAccess();
                        commsForms.add(formDetails);
                        break;
                }
            }
        }
    }

    private boolean hasAccess(String... rolesArray) {
        boolean hasAccess = false;
        List<String> roles = Arrays.asList(rolesArray);
        List<Role> userRoles = GlobalConstants.USER.getUserRoles();
        for (Role role : userRoles) {
            if (roles.contains(role.getRoleName())) {
                hasAccess = true;
                break;
            }
        }
        return hasAccess;
    }

    /*
     */
    /*
     * Would be needed if we filter the forms on privileges
     * *//*

    private boolean hasPrivilege(DataProvider.FormCategory formCategory) {
        List<Role> userRoles = GlobalConstants.USER.getUserRoles();
        if (userRoles != null) {
            for (Role role : userRoles) {
                for (RolePrivilege privilege : role.getRolePrivileges()) {
                    if (formCategory.getPrivilege().contains(privilege.getPrivilegeName()))
                        return true;
                }
            }
        }

        return false;
    }
*/

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

    }

    private void initList() {

        adapter = new TabAdapter(getActivity().getSupportFragmentManager(), FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        adapter.addFragment(FormListFragment.newInstace(lseForms, "lse"), "LSE");
        adapter.addFragment(FormListFragment.newInstace(shrmForms, "srhm"), "SRHM");
        adapter.addFragment(FormListFragment.newInstace(commsForms, "comms"), "COMMS");
        binding.pager.setAdapter(adapter);
        binding.tabLayout.setupWithViewPager(binding.pager);

    }


}
