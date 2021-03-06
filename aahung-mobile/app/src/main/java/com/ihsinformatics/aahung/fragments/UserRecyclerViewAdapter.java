package com.ihsinformatics.aahung.fragments;

import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.common.Utils;
import com.ihsinformatics.aahung.model.BaseItem;

import java.util.ArrayList;
import java.util.List;


public class UserRecyclerViewAdapter extends RecyclerView.Adapter<UserRecyclerViewAdapter.ViewHolder> implements Filterable {

    private List<BaseItem> mValues;
    private List<BaseItem> mValuesFiltered;
    private final UserContract.AdapterInteractionListener mListener;

    public UserRecyclerViewAdapter(List<? extends BaseItem> items, UserContract.AdapterInteractionListener listener) {
        List<BaseItem> filteredList = Utils.getNonVoidList(items);
        mValues = (List<BaseItem>) filteredList;
        mValuesFiltered = (List<BaseItem>) filteredList;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.dialog_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        holder.mItem = mValuesFiltered.get(position);
        holder.id.setText("" + mValuesFiltered.get(position).getShortName());
        holder.name.setText(mValuesFiltered.get(position).getName());
        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    mListener.onUserSelected(holder.mItem, position);
                }
            }
        });
    }

    public void removeAt(int position) {

        try {
            mValuesFiltered.remove(position);
            notifyItemRemoved(position);
            notifyItemRangeChanged(position, mValuesFiltered.size());
        } catch (IndexOutOfBoundsException e) {
            e.printStackTrace();
        }

    }

    @Override
    public int getItemCount() {
        return mValuesFiltered != null ? mValuesFiltered.size() : 0;
    }

    public void addUser(BaseItem mUser) {
        mValuesFiltered.add(mUser);
        notifyDataSetChanged();
    }

    public void updateData(List<BaseItem> users) {
        mValues = users;
        mValuesFiltered = users;
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        public final View mView;
        public final TextView id;
        public final TextView name;
        public BaseItem mItem;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            id = (TextView) view.findViewById(R.id.id);
            name = (TextView) view.findViewById(R.id.name);
        }

        @Override
        public String toString() {
            return super.toString() + " '" + name.getText() + "'";
        }
    }


    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                String charString = charSequence.toString();
                if (charString.isEmpty()) {
                    mValuesFiltered = mValues;
                } else {
                    List<BaseItem> filteredList = new ArrayList<>();
                    for (BaseItem row : mValues) {

                        if ((row.getName().toLowerCase().contains(charString.toLowerCase()) || String.valueOf(row.getShortName()).contains(charSequence)) && !row.isVoided()) {
                            filteredList.add(row);
                        }
                    }
                    mValuesFiltered = filteredList;
                }

                FilterResults filterResults = new FilterResults();
                filterResults.values = mValuesFiltered;
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                mValuesFiltered = (ArrayList<BaseItem>) filterResults.values;
                notifyDataSetChanged();
            }
        };
    }


}
